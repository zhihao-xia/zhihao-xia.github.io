import { readFile, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const data = JSON.parse(await readFile(new URL("assets/publications.json", root), "utf8"));
const papers = [...data.papers].sort((a, b) => b.date.localeCompare(a.date));
const years = [...new Set(papers.map((p) => p.year))];
const escape = (text = "") => String(text).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[char]);
const dateLabel = (date) => new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
  month: "short", day: "numeric", year: "numeric", timeZone: "UTC",
});
const authors = (paper) => paper.authors.map((name, index) => {
  const nameHtml = name === "Zhihao Xia" ? `<strong>${escape(name)}</strong>` : escape(name);
  const separator = index === 0 ? "" : index === paper.authors.length - 1 ? ", and " : ", ";
  return separator + nameHtml;
}).join("");
const venue = (paper) => {
  const volume = paper.volume ? `, ${escape(paper.volume)}${paper.issue ? `(${escape(paper.issue)})` : ""}` : "";
  const pages = paper.pages ? `${paper.volume ? ":" : ", pp. "}${escape(paper.pages)}` : "";
  return `<em>${escape(paper.venue)}</em>${volume}${pages}${paper.kind === "preprint" ? `, arXiv:${escape(paper.arxiv)}` : ""}.`;
};
const links = (paper) => [
  paper.doi ? `<a href="https://doi.org/${escape(paper.doi)}">${paper.arxiv && paper.status === "published" ? "Published version" : "Paper / DOI"}</a>` : "",
  paper.arxiv ? `<a href="https://arxiv.org/abs/${escape(paper.arxiv)}">arXiv preprint</a>` : "",
].filter(Boolean).join("\n");

const ids = new Set();
const dois = new Set();
for (const paper of papers) {
  if (ids.has(paper.id) || (paper.doi && dois.has(paper.doi))) throw new Error(`Duplicate publication: ${paper.id}`);
  if (paper.status !== "accepted" && !paper.authors.includes("Zhihao Xia")) throw new Error(`Missing author: ${paper.id}`);
  ids.add(paper.id);
  if (paper.doi) dois.add(paper.doi);
}

const record = (paper) => `<article class="publication-record" id="${escape(paper.id)}" data-kind="${paper.kind}" data-status="${paper.status}">
  <div class="publication-meta"><span>${paper.kind === "journal" ? "Journal" : paper.kind === "conference" ? "Conference" : "Preprint"}</span>${paper.status === "accepted" ? `<span class="publication-status">Accepted ${dateLabel(paper.date)}</span>` : ""}</div>
  <h3>${escape(paper.title)}</h3>
  ${paper.authors.length ? `<p class="publication-authors">${authors(paper)}.</p>` : ""}
  <p class="publication-venue">${venue(paper)}</p>
  ${links(paper) ? `<div class="inline-links">${links(paper)}</div>` : ""}
</article>`;

const publications = `<form class="publication-filters" id="publication-filters" hidden role="search" aria-label="Search publications">
  <fieldset class="publication-modes">
    <legend class="sr-only">Publication type</legend>
    ${[["all", "All"], ["journal", "Journals"], ["conference", "Conferences"], ["preprint", "Preprints"]].map(([value, label]) => `<label><input type="radio" name="type" value="${value}" ${value === "all" ? "checked" : ""} /><span>${label}</span></label>`).join("\n")}
  </fieldset>
  <label class="publication-search"><span class="sr-only">Search titles, authors, or venues</span><input type="search" name="query" aria-label="Search titles, authors, or venues" placeholder="Search publications" /></label>
</form>
<div class="publication-overview"><p id="publication-count" role="status" aria-live="polite">${papers.length} works</p><p>${papers.filter((p) => p.status === "published").length} published · ${papers.filter((p) => p.status === "accepted").length} accepted · ${papers.filter((p) => p.status === "preprint").length} preprints</p></div>
<div class="publication-layout">
  <nav class="publication-years" aria-label="Publication years">${years.map((year) => `<a href="#year-${year}" data-year="${year}">${year}<span>${papers.filter((p) => p.year === year).length}</span></a>`).join("\n")}</nav>
  <div class="publication-results">
    ${years.map((year) => `<section class="publication-year-group" id="year-${year}" data-year="${year}" aria-labelledby="heading-${year}"><h2 id="heading-${year}">${year}</h2>${papers.filter((p) => p.year === year).map(record).join("\n")}</section>`).join("\n")}
    <p class="publication-empty" id="publication-empty" hidden>No matching publications.</p>
  </div>
</div>`;

const recent = `<div class="compact-publication-list">${["kinematic-neural-networks", "differentiable-kinematics", "physically-aware-design"].map((id) => {
  const paper = papers.find((p) => p.id === id);
  return `<article class="compact-publication">
    <p class="publication-meta">${paper.status === "accepted" ? "Accepted" : "Published"} · ${paper.year}</p>
    <h3><a href="publications.html#${paper.id}">${escape(paper.title)}</a></h3>
    <p><em>${escape(paper.venue)}</em></p>
  </article>`;
}).join("\n")}</div>`;

// Static HTML keeps the complete bibliography available without JavaScript.
async function updateRegion(file, name, content) {
  const path = new URL(file, root);
  const html = await readFile(path, "utf8");
  const start = `<!-- BEGIN ${name} -->`, end = `<!-- END ${name} -->`;
  const from = html.indexOf(start), to = html.indexOf(end);
  if (from < 0 || to <= from) throw new Error(`Missing generated region: ${file} / ${name}`);
  const indented = content.split("\n").map((line) => line.trimEnd() ? `        ${line.trimEnd()}` : "").join("\n");
  const next = html.slice(0, from + start.length) + "\n" + indented + "\n        " + html.slice(to);
  await writeFile(path, next, "utf8");
}

await updateRegion("publications.html", "PUBLICATIONS", publications);
await updateRegion("index.html", "RECENT PUBLICATIONS", recent);
console.log(`Rendered ${papers.length} publications across ${years.length} years.`);

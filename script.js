const year = document.querySelector("#year");

if (year) {
  year.textContent = new Date().getFullYear();
}

const publicationForm = document.querySelector("#publication-filters");

if (publicationForm) {
  const records = [...document.querySelectorAll(".publication-record")];
  const groups = [...document.querySelectorAll(".publication-year-group")];
  const yearLinks = [...document.querySelectorAll(".publication-years a")];
  const count = document.querySelector("#publication-count");
  const empty = document.querySelector("#publication-empty");
  const normalize = (text) => text.normalize("NFKC").toLowerCase().replace(/\s+/g, " ").trim();
  const searchable = new Map(records.map((record) => [record, normalize(record.textContent)]));

  function filterPublications() {
    const form = new FormData(publicationForm);
    const kind = form.get("type");
    const terms = normalize(form.get("query") || "").split(" ").filter(Boolean);
    let visible = 0;

    records.forEach((record) => {
      const matches = (kind === "all" || record.dataset.kind === kind) &&
        terms.every((term) => searchable.get(record).includes(term));
      record.hidden = !matches;
      if (matches) visible += 1;
    });
    groups.forEach((group) => {
      const remaining = group.querySelectorAll(".publication-record:not([hidden])").length;
      group.hidden = remaining === 0;
      const link = yearLinks.find((item) => item.dataset.year === group.dataset.year);
      link.hidden = remaining === 0;
      link.querySelector("span").textContent = remaining;
    });
    count.textContent = `${visible} ${visible === 1 ? "work" : "works"}`;
    empty.hidden = visible !== 0;
  }

  publicationForm.hidden = false;
  publicationForm.addEventListener("input", filterPublications);
  publicationForm.addEventListener("change", filterPublications);
  publicationForm.addEventListener("submit", (event) => event.preventDefault());
  filterPublications();
}

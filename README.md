# Zhihao Xia Academic Homepage

This is a lightweight static academic homepage for GitHub Pages.

Website: https://zhihao-xia.github.io/

## Files

- `index.html`: page content and structure
- `research.html`: detailed research project page
- `publications.html`: publication and patent list
- `gallery.html`: photo gallery page
- `about.html`: profile, education, honors, service, skills, and contact
- `styles.css`: responsive visual design
- `script.js`: publication search, type filters, and footer year
- `assets/publications.json`: bibliography and dated Scopus statistics
- `scripts/build-publications.mjs`: renders the bibliography and recent work into static HTML
- `assets/profile-photo.jpg`: public, compressed portrait used on the homepage
- `assets/profile-placeholder.svg`: fallback portrait placeholder
- `assets/gallery/`: publishable gallery images
- `assets/media/`: publishable video/media files
- `assets/research-temp/`: local-only temporary research images ignored by Git
- `补充材料(无需上传)/`: local-only reference materials ignored by Git
- `.history/`: editor local history ignored by Git

## Publish on GitHub Pages

1. Create a repository named `zhihao-xia.github.io`.
2. Upload these files to the repository root.
3. Open `Settings -> Pages`.
4. Set the source to the main branch root.
5. Visit `https://zhihao-xia.github.io`.

If uploading through the GitHub web UI instead of Git, do not upload
`补充材料(无需上传)/`, `assets/research-temp/`, or `.history/`.

## Personalize

Edit `assets/publications.json`, then run `node scripts/build-publications.mjs`
to update the publication list, recent work, and Scopus snapshot together.
Commit both the data and generated HTML. All publications remain readable
without JavaScript; search and filters are progressive enhancements.
Keep the original author order. Use `accepted` only after acceptance, and
merge a preprint into its published record when a journal version appears.
Scopus numbers are a dated snapshot, not a live counter.

- Keep the public contact section limited to information you are comfortable publishing.
- Keep `News` concise and date each update clearly.
- Keep the homepage lightweight: profile summary plus news only.
- Update publications, projects, honors, and links on their own classified pages.
- Add a public, privacy-reviewed CV as `cv.pdf` only when ready.
- Keep original private photos in `补充材料(无需上传)/`; publish only compressed copies in `assets/`.
- Replace temporary research images in `assets/research-temp/` with your own images or confirmed-permission images before public release, then move the approved images to a publishable assets folder.
- Current temporary research images were taken from `https://www.chxtian.top/research.html` for local drafting.

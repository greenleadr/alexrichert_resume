# Alexander Richert — Resume Website

Personal resume site for Alexander Richert, Customer Success Leader.

Static, dependency-free: vanilla HTML, CSS, and a small JS file for the dark-mode toggle, smooth-scroll active nav, and the "Download PDF" print trigger.

## Local preview

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Deploy to GitHub Pages

1. Push the repository to GitHub (branch `main`).
2. Go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Select branch `main` and folder `/ (root)`, then **Save**.
5. GitHub Pages will publish the site at `https://<username>.github.io/alexrichert_resume/`.

The `.nojekyll` file at the repo root disables Jekyll processing so files are served as-is.

## Files

- `index.html` — resume content
- `styles.css` — light/dark themes, responsive, print stylesheet
- `script.js` — theme toggle, active-section nav, print trigger
- `assets/favicon.svg` — monogram favicon
- `.nojekyll` — disables Jekyll on GitHub Pages

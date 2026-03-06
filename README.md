# vCAT Website

Multi-page website for Copenhagen AirTaxi Virtual.

## Pages
- `/index.html` (home)
- `/airlines.html`
- `/routes.html`
- `/fleet.html`
- `/destinations.html`
- `/operations.html`
- `/community.html`
- `/admin.html` (operations console)

## Run locally
```bash
python3 -m http.server 8000
```

Then open:
- `http://localhost:8000/index.html`
- `http://localhost:8000/admin.html`

## If your PR says "This branch has conflicts"
Use command-line merge resolution (faster than GitHub web editor):

```bash
git checkout work
git fetch origin
git merge origin/main
```

Fix conflicts in the files Git reports, then:

```bash
git add README.md admin.html app.js index.html styles.css
git commit -m "Resolve merge conflicts with main"
git push origin work
```

If you want to keep your branch version for all conflicted files:

```bash
git checkout --ours README.md admin.html app.js index.html styles.css
git add README.md admin.html app.js index.html styles.css
git commit -m "Resolve conflicts keeping work branch versions"
git push origin work
```

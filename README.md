# Portfolio — Bharath Kumar Reddy Allampati

Personal portfolio site for a CS undergrad specializing in Information Security. Static, no build step, deployable directly on GitHub Pages.

## Structure
```
.
├── index.html      # markup
├── styles.css       # all styling
├── script.js        # terminal animation, scroll progress, reveal-on-scroll
├── Photos/           # profile photo
└── icons/            # favicon / social icons (add your own)
```

## Stack
HTML5, CSS3, vanilla JavaScript. Fonts loaded from Google Fonts (Space Grotesk, IBM Plex Mono, Inter).

## Run locally
No build tools needed. Just open `index.html` in a browser, or serve it:
```
python3 -m http.server 8000
```

## Deploy (GitHub Pages)
1. Push this repo to GitHub.
2. Settings → Pages → Source: `main` branch, `/ (root)`.
3. Site goes live at `https://<username>.github.io/<repo-name>`.

## To finish before going live
- [ ] Add real GitHub repo links in the Projects section (`index.html`, search for `href="#"`)
- [ ] Add LinkedIn and GitHub URLs in the footer contact block
- [ ] Add a favicon to `/icons`
- [ ] Confirm name spelling is consistent with resume/LinkedIn/certs

## License
Personal project — feel free to fork the structure, swap the content.

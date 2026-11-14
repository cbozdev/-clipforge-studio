# ClipForge Studio

Free, local-first video clipping and editing in the browser. No backend, no paid APIs.

## Status
**Stage 1 (dashboard, projects) and Stage 2 (import, metadata, playback) are written.** Everything else in the roadmap is not built yet.

## Run
    npm install
    npm run dev      # open the printed network URL on your iPhone (same Wi-Fi)
    npm run build

## Deploy (GitHub Pages)
1. Create a GitHub repo, push this folder to `main`.
2. Repo Settings → Pages → Source: **GitHub Actions**.
3. Every push to `main` builds and publishes. Site: `https://<user>.github.io/<repo>/`.

Routing uses `#/` URLs and `base: './'`, so no server rules or repo-name config are needed.

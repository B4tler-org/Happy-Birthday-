# For Safalta 💖

A small, cinematic birthday website — soft pink, white, lavender, and gold,
built as one locked hero screen that opens into a set of full-screen,
scroll-snapped sections: a welcome, a 30-second voice message, a love
letter you unfold from an envelope, appreciation cards, and a starry
"memory sky" at the end.

Pure HTML, CSS, and JavaScript. No frameworks, no build tools, no
dependencies to install — just files you can open in a browser or
publish straight to GitHub Pages.

## How it flows

1. **Hero (locked)** — the page loads showing only the hero. Scrolling is
   disabled on purpose, so this is the only thing visible at first.
2. **"Open My Heart"** — pressing it plays a short cinematic transition
   (fade, blur, a burst of glowing floating hearts), then unlocks
   scrolling and reveals the rest of the site.
3. From there, the visitor scrolls through five full-screen sections that
   snap into place: **Welcome → Voice Message → Love Letter →
   Appreciation → Memory Sky**.

## Project structure

```
safalta-birthday/
├── index.html          the page itself (hero + all sections)
├── style.css             all styling, colors, and animations
├── script.js              all interactivity (loader, transition, player, envelope, canvases)
├── assets/
│   └── README.md          instructions for adding your voice message file
└── README.md               this file
```

## 1. Add your voice message (optional but recommended)

The player looks for a file at `assets/voice-message.mp3`.

1. Record or export a short birthday message (around 30 seconds works well).
2. Name the file `voice-message.mp3`.
3. Drop it into the `assets/` folder.

If you skip this step, the site still works — the Play button will just
show a gentle reminder message instead of playing audio.

## 2. Try it locally first (optional)

You can just double-click `index.html` to open it in a browser. Some
browsers restrict audio loading from local files (`file://`), so if
the player misbehaves locally, don't worry — it will work correctly
once published on GitHub Pages, which serves everything over `https://`.

## 3. Publish it on GitHub Pages

### Option A — using GitHub's website (no command line needed)

1. Go to [github.com](https://github.com) and log in (or create a free account).
2. Click the **+** icon in the top right → **New repository**.
3. Name it something like `for-safalta` (any name works). Set it to **Public**. Click **Create repository**.
4. On the new repository page, click **uploading an existing file** (or **Add file → Upload files**).
5. Drag in `index.html`, `style.css`, `script.js`, and the whole `assets` folder (including your `voice-message.mp3` if you added one). Make sure they land at the **root** of the repository, not inside an extra subfolder.
6. Scroll down and click **Commit changes**.
7. Go to the repository's **Settings** tab → **Pages** (in the left sidebar).
8. Under **Build and deployment → Source**, choose **Deploy from a branch**.
9. Under **Branch**, choose `main` (or `master`) and folder `/ (root)`, then click **Save**.
10. Wait a minute or two, then refresh the Pages settings page — you'll see a green box with your live URL, something like:

    ```
    https://your-username.github.io/for-safalta/
    ```

That link is ready to share.

### Option B — using Git from the command line

```bash
# from inside the safalta-birthday folder
git init
git add .
git commit -m "For Safalta 💖"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/for-safalta.git
git push -u origin main
```

Then follow steps 7–10 above in your repository's Settings → Pages
to turn on GitHub Pages for the `main` branch.

## 4. Personalizing further

- **Letter text** lives inside `<article class="letter-paper">` in `index.html`, under the "LOVE LETTER" section.
- **Colors** are defined once as CSS variables near the top of `style.css` (`:root { --blush: ...; --rose: ...; --gold: ...; }`) — change them there and the whole site updates.
- **Cards** (smile, kindness, etc.) are the `.card` elements inside `<section id="appreciation">`.
- **Signature name** ("— Samir") appears at the end of the letter and in the Memory Sky section — search for `Samir` in `index.html` to update it.
- **Transition timing** (how long the cinematic open takes) is controlled by the `revealDelay`, `fadeOutDelay`, and `cleanupDelay` values inside `initCinematicOpen()` in `script.js`.

## Notes

- Fully responsive, mobile-first — tested down to small phone widths.
- CSS scroll-snap keeps each section full-screen while scrolling, once unlocked.
- Respects `prefers-reduced-motion`: the cinematic transition, floating hearts, and canvases all shorten or simplify for visitors who've asked their device to limit animation.
- No external JS libraries or CSS frameworks — only two Google Fonts
  (Cormorant Garamond and Quicksand) loaded via `<link>` in `index.html`.
- The voice message never autoplays; it only starts when the Play button is pressed.

Happy Birthday, Safalta. 💖

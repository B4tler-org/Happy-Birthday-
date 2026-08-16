# For Safalta 💖

A small, cinematic birthday website — soft pink, white, lavender, and gold,
built as one locked hero screen that opens into a set of full-screen,
scroll-snapped sections: a welcome, a birthday video, a 30-second voice
message, a love letter you unfold from an envelope, appreciation cards,
and a starry "memory sky" at the end with a proper goodbye.

Pure HTML, CSS, and JavaScript. No frameworks, no build tools, no
dependencies to install — just files you can open in a browser or
publish straight to GitHub Pages.

## How it flows

1. **Hero (locked)** — the page loads showing only the hero. Scrolling is
   disabled on purpose, so this is the only thing visible at first.
2. **"Open My Heart"** — pressing it plays a short cinematic transition
   (fade, blur, a burst of glowing floating hearts), then unlocks
   scrolling and reveals the rest of the site.
3. From there, the visitor scrolls (or taps the glowing **Next ↓** button
   at the bottom of each section) through six full-screen sections:
   **Welcome → Video → Voice Message → Love Letter → Appreciation →
   Memory Sky**.
4. On the last section, a red **Close ❤️** button replaces "Next." Pressing
   it fades in a full-screen goodbye message, waits a few seconds, then
   tries to close the tab — falling back to `goodbye.html` if the browser
   blocks that (which most do, and that's expected).

## Project structure

```
safalta-birthday/
├── index.html            the page itself (hero + all sections)
├── style.css              all styling, colors, and animations
├── script.js               all interactivity (loader, transition, player, envelope, canvases, close flow)
├── goodbye.html            fallback page shown if the tab can't be auto-closed
├── goodbye.js               starry/hearts background for goodbye.html
├── assets/
│   ├── README.md            instructions for the voice message file
│   └── video/
│       └── README.md        instructions for the video + poster files
└── README.md                 this file
```

## 1. Add your media (optional but recommended)

**Voice message** — the player looks for `assets/voice-message.mp3`.
1. Record or export a short birthday message (around 30 seconds works well).
2. Name it `voice-message.mp3` and drop it into `assets/`.

**Video** — the video card looks for `assets/video/birthday.mp4`, with an
optional thumbnail at `assets/video/poster.jpg`.
1. Export your video as an MP4 (H.264 is the safest format).
2. Name it `birthday.mp4` and drop it into `assets/video/`.
3. Optionally add a `poster.jpg` there too, for a nicer thumbnail before she presses play.

If you skip either step, the site still works — the relevant Play button
will just show a gentle reminder message instead of playing.

## 2. Try it locally first (optional)

You can just double-click `index.html` to open it in a browser. Some
browsers restrict audio/video loading from local files (`file://`), so if
playback misbehaves locally, don't worry — it will work correctly once
published on GitHub Pages, which serves everything over `https://`.

## 3. Publish it on GitHub Pages

### Option A — using GitHub's website (no command line needed)

1. Go to [github.com](https://github.com) and log in (or create a free account).
2. Click the **+** icon in the top right → **New repository**.
3. Name it something like `for-safalta` (any name works). Set it to **Public**. Click **Create repository**.
4. On the new repository page, click **uploading an existing file** (or **Add file → Upload files**).
5. Drag in `index.html`, `style.css`, `script.js`, `goodbye.html`, `goodbye.js`, and the whole `assets` folder (including your media files). Make sure they land at the **root** of the repository, not inside an extra subfolder.
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

## 4. About the "Close" button

Browsers only allow `window.close()` to work on tabs that a script opened
(e.g. via `window.open()`). A normal tab — like one opened from a shared
link on GitHub Pages — almost always **can't** be closed by the page
itself, by design, for security reasons. That's expected here: the site
still tries `window.close()` first, and if it's blocked (which it will be,
most of the time), it automatically redirects to `goodbye.html` instead —
a matching, calm final screen that simply tells her she can close the tab
herself.

## 5. Personalizing further

- **Letter text** lives inside `<article class="letter-paper">` in `index.html`, under the "LOVE LETTER" section.
- **Goodbye message** appears in two places — inside `#goodbye-message` in `index.html`, and inside `.sky-content` in `goodbye.html` — search for "Thank you for visiting" to update both.
- **Colors** are defined once as CSS variables near the top of `style.css` (`:root { --blush: ...; --rose: ...; --gold: ...; }`) — change them there and the whole site (including `goodbye.html`, which shares the same stylesheet) updates.
- **Cards** (smile, kindness, etc.) are the `.card` elements inside `<section id="appreciation">`.
- **Signature name** ("— Samir") appears in the letter, the Memory Sky section, and `goodbye.html` — search for `Samir` to update it everywhere.
- **Transition timing** (cinematic open, and the close/goodbye sequence) is controlled by the delay values inside `initCinematicOpen()` and `initCloseFlow()` in `script.js`.

## Notes

- Fully responsive, mobile-first — tested down to small phone widths.
- CSS scroll-snap keeps each section full-screen while scrolling, once unlocked; the **Next ↓** buttons give the same navigation without relying on the visitor discovering they can scroll.
- Respects `prefers-reduced-motion`: the cinematic transition, floating hearts, canvases, and close sequence all shorten or simplify for visitors who've asked their device to limit animation.
- No external JS libraries or CSS frameworks — only two Google Fonts
  (Cormorant Garamond and Quicksand) loaded via `<link>`.
- Neither the voice message nor the video autoplay; both only start when their Play button is pressed.

Happy Birthday, Safalta. 💖

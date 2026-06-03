# My Father's Sheep Podcast Website

A premium, exquisite website designed for the **My Father's Sheep** podcast fellowship. The site features a luxury **Boutique Editorial** design system utilizing soft cream-and-white palettes, dynamic background light animations, floating navigation pills, a custom-coded interactive audio player, and a local-persistence testimony board.

> *"We are lit to be seen, sent to reveal Christ, and sustained by belonging to Him. My father’s sheep podcast is where the minds of men are transformed into the likeness of him."*

---

## Features

- **Boutique Editorial Design**: Tailored cream-and-white theme featuring dynamic ambient glowing blobs, floating capsule navigation, and high-fashion serif display typography.
- **Bento Grid Layout**: Beautifully showcases the three foundational pillars of the fellowship: *Lit to be Seen*, *Sent to Reveal*, and *Sustained by Belonging*.
- **Interactive Audio Player**: A custom-styled glassmorphic player card displaying episode info, progress time, volume sliders, and a pulsing audio waveform.
- **Boutique Merch Shop**: Displays upcoming apparel (Signature T-Shirt and Essential Hoodie) with color-swatch selectors that dynamically adjust mockup backgrounds and card glows, complete with a frosted glass "Coming Soon" locking layer.
- **Fellowship Testimony Board**: Interactive form allowing visitors to share how the podcast has blessed them, instantly updating a localized masonry-style card wall (stored in `localStorage`).
- **Design Intelligence**: Includes the core database and scripts of the **UI/UX Pro Max** skill under the `src/` directory, allowing you to run local design system searches in your IDE.

---

## File Structure

```
├── assets/                     # Media and assets
│   ├── logo.svg                # Vector flock emblem
│   ├── tshirt.png              # Generated cream T-Shirt mockup
│   └── hoodie.png              # Generated sand Hoodie mockup
├── src/                        # UI/UX Pro Max search databases
│   └── ui-ux-pro-max/          # Design system canonical CSV files & search engine
├── index.html                  # Main markup structure
├── style.css                   # Custom styles, transitions, and typography
├── app.js                      # Client-side routing, player, and form logic
└── .gitignore                  # Git ignore rules
```

---

## Local Development

To run the website locally:

1. Open your terminal in this directory.
2. Start a Python HTTP server:
   ```bash
   python -m http.server 3000
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## Deployment to Vercel

This website is ready for direct deployment to Vercel. 

### How to deploy:
1. Initialize a new git repository in this folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
2. Create a new repository on GitHub and push your code.
3. Import your GitHub repository into [Vercel](https://vercel.com).
4. Vercel will automatically detect the static files and host them for you!

### Connecting a Database for Testimonies:
Currently, testimonies are saved locally in the browser's `localStorage` (meaning they only show up on your device). To sync them across all visitors:
1. In your Vercel Dashboard, create a **Vercel Postgres** or **Vercel KV** database.
2. Create a serverless function endpoint (e.g. `api/testimonies.js`).
3. Update the form submit handler in `app.js` to send a POST request to your API instead of saving to `localStorage`.

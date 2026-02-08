
# Woovla - Website Builder

Woovla is a premium, mobile-first website builder designed to be simpler and more beautiful than traditional tools.

## Features
- **Visual Block Canvas**: Drag, add, and reorder blocks easily.
- **Contextual Editing**: No sidebars. Tap a block, and a floating modal appears right where you need it.
- **Responsive Previews**: Switch between Mobile, Tablet, and Desktop views instantly.
- **Undo/Redo**: Full history management.
- **Premium Design System**: Borders-less fields, glassmorphism, and soft shadows.

## Tech Stack
- **Frontend**: React, TypeScript, Zustand, Tailwind CSS.
- **Icons**: Lucide React.
- **Backend Ready**: Configured for Supabase (Auth + Storage + DB).

## Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   # or
   npm start
   ```

## Connecting to GitHub & Deployment

### 1. Initialize Git
Run these commands in your terminal to set up git for this project:
```bash
git init
git add .
git commit -m "Initial commit"
```

### 2. Create Repository
1. Go to [GitHub.com/new](https://github.com/new).
2. Create a new repository (name it `woovla-builder`).
3. Copy the instructions for "…or push an existing repository from the command line".

### 3. Push Code
Paste the commands from GitHub into your terminal. They typically look like this:
```bash
git remote add origin https://github.com/YOUR_USERNAME/woovla-builder.git
git branch -M main
git push -u origin main
```

### 4. Deploy to Netlify
1. Log in to [Netlify](https://www.netlify.com).
2. Click **"Add new site"** > **"Import from an existing project"**.
3. Select **GitHub**.
4. Choose the `woovla-builder` repository.
5. Netlify will detect the `netlify.toml` file automatically.
6. Click **Deploy**.

## Design Philosophy
Woovla aims for a "Calm Tech" experience. We prioritize whitespace, high-quality typography, and touch-first interactions. Every control is designed to be accessible by thumb on mobile devices.

# datarheo.io

A React and Vite marketing site for Datarheo, focused on data movement, integration, pipelines, and connected systems.

## Stack

- React 18
- Vite 5
- React Router
- Page-specific CSS and an animated theme layer

## Pages

- `/` — Home page with product overview, connectors, workflow examples, pricing, FAQ, and contact form
- `/login` — Business ID sign-in page

## Project structure

```text
datarheo.io/
├── public/
│   └── images/
├── src/
│   ├── components/        # Shared UI components
│   ├── hooks/             # Shared React hooks
│   ├── pages/             # Route pages
│   ├── App.jsx            # Route definitions
│   ├── main.jsx           # Application entry point
│   ├── index.css          # Global foundation and shared navigation styles
│   ├── home.css           # Home-page layout and component styles
│   ├── login.css          # Login-page styles
│   └── animations.css     # Theme animations and motion effects
├── index.html
├── package.json
└── vite.config.js
```

## Getting started

```bash
git clone https://github.com/Vrahad-Analytics/datarheo.io.git
cd datarheo.io
npm install
npm run dev
```

The development server opens the site automatically at `http://localhost:3000`.

## Available scripts

```bash
npm run dev      # Start the development server
npm run build    # Create a production build in dist/
npm run preview  # Preview the production build locally
```

## Styling

The stylesheet import order in `src/main.jsx` is intentional:

1. `index.css` supplies global tokens and shared styles.
2. `home.css` and `login.css` supply page-specific layout.
3. `animations.css` loads last so motion and visual theme overrides take precedence.

Motion respects the user's `prefers-reduced-motion` setting.

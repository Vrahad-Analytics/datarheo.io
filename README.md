# datarheo.io

A React and Vite marketing site for Datarheo, focused on automated data movement between the systems a team already runs and the warehouse it analyses in.

## Stack

- React 18
- Vite 5
- React Router
- Bootstrap and React Bootstrap
- Page-specific CSS and an animated theme layer

## Pages

- `/` — Home page: navy hero, tech-stack marquee, capability stats, alternating
  platform feature rows with product UI mockups, animated flow diagram, interactive
  pipeline control centre, connector directory with search, governance band, pricing,
  FAQ, closing CTA, and contact form
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

Vite prints the local development URL in the terminal. This project pins the dev server
to port 3000 in `vite.config.js`, so it is normally `http://localhost:3000`.

## Available scripts

```bash
npm run dev      # Start the development server
npm run build    # Create a production build in dist/
npm run preview  # Preview the production build locally
```

## Styling

The stylesheet import order in `src/main.jsx` is intentional:

1. `index.css` supplies the design tokens (navy/blue palette, radii, shadows),
   base typography, and the shared navigation.
2. `home.css` and `login.css` supply page-specific layout.
3. `animations.css` loads last and only refines — it adds motion and hover
   detail, never layout, so removing it leaves the pages intact.

Headings deliberately do not set a colour of their own; they inherit, so a section
that sets `color` on a dark background carries its headings with it.

Motion respects the user's `prefers-reduced-motion` setting.

# datarheo.io

A React and Vite marketing site for Datarheo, focused on data movement, integration, pipelines, and connected systems.

## Stack

- React 18
- Vite 5
- React Router
- Page-specific CSS and an animated theme layer

## Pages

- `/` — Home page with product overview, connectors, workflow examples, pricing, FAQ, and contact form
- `/login` — Email/password sign-in with an on-site confirmation and pipeline-demo link
- `/register` — Account details, email verification, and password setup
- Unknown paths display a helpful not-found page.

The pipeline studio and hero statistics are demonstrations, not live backend telemetry.
The existing backend provides account registration and login, not a data-workspace API.
Sign-in keeps the token in tab-scoped session storage; it does not redirect to another
domain or pass credentials in a URL. Reloading the sign-in page shows the form again.

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
cd /path/to/datarheo.io/Frontend
cp .env.example .env.local
npm ci
npm run dev
```

Use Node.js 22. Open `http://localhost:5173` for the frontend.
In a second terminal, start the existing Express backend:

```bash
cd /path/to/datarheo.io/Backend
cp .env.example .env
npm ci
npm start
```

Fill in the backend environment file before starting:

| Backend setting | Purpose |
| --- | --- |
| `MONGO_URI` | MongoDB connection string; allow network access from the backend host |
| `JWT_SECRET` | Strong, randomly generated signing secret |
| `EMAIL_USER` | Gmail account used to send verification codes |
| `EMAIL_PASSWORD` | Gmail app password (not your normal account password) |
| `FRONTEND_URL` | Comma-separated, exact frontend origins allowed by CORS, with no trailing slash |
| `PORT` | HTTP port; defaults to `5000` |

Keep these values in the backend host's secret/environment settings, never in frontend
variables or committed files. Codes expire after 10 minutes; account setup allows
starting over to request a new code.

## Available scripts

```bash
npm run dev      # Start the development server
npm run build    # Create a production build in dist/
npm run preview 
```

There are no lint or automated test scripts in either package. Validate the production
build and exercise the browser flows against your configured backend.

## Deploy to AWS Amplify Hosting

1. Host the Express backend separately on an HTTPS-capable service, such as AWS App
   Runner or Elastic Beanstalk, with MongoDB access and the backend settings above.
   Start it with `npm start` from the backend directory. Amplify's static Vite hosting
   does **not** run the Express server or provision MongoDB/email services.
2. Connect this repository in the Amplify console. Select the monorepo option and set
   the application root to **`Frontend`** (case-sensitive). Set
   `AMPLIFY_MONOREPO_APP_ROOT=Frontend` if it is not populated automatically.
   The repository-root `amplify.yml` installs Node.js 22, runs `npm ci` and `npm run build`
   within that application root, and publishes **`Frontend/dist`**, not the source tree.
3. Set the Amplify build environment variable `VITE_API_URL` to the backend's HTTPS
   origin, for example `https://api.example.com`, without `/api/auth`. All `VITE_`
   variables are public. Redeploy after changing them because Vite embeds them at
   build time. Production intentionally does not fall back to visitors' localhost;
   missing configuration leaves the public site usable and shows an account-service
   message when a form is submitted.
4. Set the backend's `FRONTEND_URL` to the exact Amplify branch origin and any custom
   domain, separated by commas. Add preview-branch origins explicitly; do not use a
   wildcard for authentication. Restart/redeploy the backend after changes.
5. In Amplify **Hosting → Rewrites and redirects**, add this **200 rewrite** for
   extensionless SPA routes. This is a console setting, not automatically applied by
   the build specification. Place it after any intentional redirects.

   ```json
   [
     {
       "source": "</^[^.]+$/>",
       "target": "/index.html",
       "status": "200",
       "condition": null
     }
   ]
   ```

   This serves React Router on direct visits to `/login`, `/register`, and unknown
   extensionless paths, while leaving asset URLs such as JavaScript and CSS untouched.

### Deployment smoke checks

- Open the deployed home page at desktop and mobile widths; try the navigation,
  connector search, FAQ, and pipeline demo.
- Open `/login` and `/register` directly and refresh each page to verify the SPA rewrite.
- Complete registration with a real inbox, test an invalid/expired code, and confirm
  mismatched passwords cannot be submitted.
- Sign in, confirm the on-site success message, and sign out. Verify a wrong password
  shows the backend error and a network failure shows a readable retry message.
- Check the browser Network panel: requests must go to the HTTPS backend and receive
  CORS headers for the current frontend origin. Verify missing asset URLs return 404.

## Styling

The stylesheet import order in `src/main.jsx` is intentional:

1. `index.css` supplies global tokens and shared styles.
2. `home.css`, `enterprise.css`, and `home-effects.css` supply the landing page and product preview.
3. `login.css` supplies account layouts and form states.
4. `animations.css` loads last so shared motion and visual theme overrides take precedence.

Motion respects the user's `prefers-reduced-motion` setting.

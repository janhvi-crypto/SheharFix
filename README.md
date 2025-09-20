🏙️ SheharFix – Civic Issue Reporting Platform

A role-based civic engagement platform that empowers citizens to report issues via a mobile-first app and enables administrators to track, manage, and resolve issues through a web dashboard.

🚀 Features
👤 Citizen Mobile App (Responsive, Mobile-first)

📍 Report civic issues with photo/video + GPS location

🎙️ Voice + text description (multilingual support)

📊 Track issue status: Submitted → Acknowledged → In Progress → Resolved

🏆 Gamification: earn points, badges, and leaderboard rankings

🌐 Offline mode: save reports & auto-upload when online

🔒 Anonymous reporting option for sensitive issues

🗺️ View nearby issues on an interactive map

🏢 Administrator Web Portal (Desktop-first)

📊 Dashboard with summary statistics of open / in-progress / resolved issues

🗂️ Assigned issues management: resolve, upload proof photos

🗺️ Heatmap visualization for ward/zone issue clustering

🤖 AI-powered categorization & priority tagging

👥 User management: monitor citizens and staff activity

📑 Export reports (PDF / Excel) for transparency & accountability

🔑 Authentication & Role-based Access

Unified login system

Role selection: Citizen (mobile app) or Administrator (web portal)

🛠️ Tech Stack (suggested)

Frontend Framework: Vite + React + TypeScript

UI & Styling: Tailwind CSS, Shadcn UI

Backend: Node.js (Express) or Python Flask (pick one)

Database: MongoDB or MySQL / PostgreSQL

Maps: Google Maps API or OpenStreetMap (Leaflet)

AI Enhancements: NLP for auto-categorization, lightweight ML for priority prediction

Note: adjust tech choices in the repo to match the implementation you choose.

📂 Project Structure
SheharFix/
├── public/              # Static assets (icons, example images, manifest, etc.)
├── src/                 # Source code
│   ├── components/      # Reusable UI components
│   ├── pages/           # App pages (Citizen app + Admin portal views)
│   ├── features/        # Feature-specific modules (reports, users, auth, etc.)
│   ├── services/        # API client, auth handlers, map services
│   ├── utils/           # Helper functions & utilities
│   ├── styles/          # Tailwind/global styles
│   └── main.tsx         # App entry point
├── components.json      # Shadcn UI config
├── index.html           # Entry HTML file
├── package.json         # Dependencies & scripts
├── tailwind.config.ts   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite build & dev server configuration

⚡ Installation & Setup
1. Clone the repository
git clone https://github.com/<your-username>/SheharFix.git
cd SheharFix

2. Install dependencies

Using npm:

npm install


Or yarn:

yarn


Or bun:

bun install

3. Create environment file

Create a .env (or .env.local) file at the repo root and add required secrets (example):

VITE_API_BASE_URL=https://api.example.com
VITE_MAPS_API_KEY=your_maps_api_key
VITE_SENTRY_DSN=your_sentry_dsn   # optional

4. Run development server
npm run dev
# or
yarn dev
# or
bun run dev


Open your browser: http://localhost:5173

5. Build for production
npm run build
# or
yarn build

🧩 Example Scripts (package.json)

Add these scripts to your package.json if not present:

{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint \"src/**/*.{ts,tsx,js,jsx}\" --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,md}\""
  }
}

🔒 Authentication & Roles (suggested)

Use JWT + refresh tokens for session management.

Roles: citizen, admin, staff (store role in user profile).

Protect admin routes using role guard middleware on backend and route guards on frontend.

🗺️ Maps & Location

For maps: use Google Maps SDK or Leaflet + OpenStreetMap.

For geolocation: use browser navigator.geolocation with fallback to manual location input.

Store geo coordinates (lat, lng) in each issue report.

🤖 AI Enhancements (optional)

Use a lightweight NLP model or API to auto-categorize issue descriptions into categories (e.g., pothole, streetlight, waste).

Use a simple classifier to tag priority (low, medium, high) based on keywords, image analysis, or past resolution times.

📸 Screenshots

Add screenshots / GIFs of the Citizen app & Admin dashboard here.
Example markdown:

![Citizen App - Report Issue](docs/screenshots/citizen-report.png)
![Admin Dashboard - Heatmap](docs/screenshots/admin-heatmap.png)

🛡️ Roadmap

✅ Role-based login

✅ Mobile-first citizen app

✅ Admin dashboard with analytics

🔲 AI-powered categorization

🔲 Push notifications (issue updates)

🔲 QR code-based ward entry

🔲 PDF/Excel exports and scheduled reports

🤝 Contributing

Fork the repo

Create a new branch:

git checkout -b feature/your-feature-name


Make your changes & commit:

git add .
git commit -m "feat: add <feature>"


Push and open a Pull Request

Please follow the repo's code style (ESLint + Prettier) and include tests where applicable.

🧪 Testing (suggested)

Use Jest + React Testing Library for unit/component tests.

Add end-to-end tests with Playwright or Cypress for critical flows (reporting, login, admin actions).

📑 Exporting / Reports

Implement server endpoints that compile data into CSV / Excel using libraries like exceljs (Node) or pandas (Python).

Use pdfkit / puppeteer to render HTML dashboards to PDF for official reports.

🔧 Deployment (suggested)

Frontend: Vercel / Netlify / Cloudflare Pages

Backend: Heroku / Render / DigitalOcean / AWS Elastic Beanstalk

DB: MongoDB Atlas / Amazon RDS

📜 License

MIT License © 2025 [CiviCrew/Janhvi]

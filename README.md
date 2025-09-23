# 🏙️ SheharFix – Civic Issue Reporting Platform

A **role-based civic engagement platform** that empowers **citizens** to report issues via a **mobile-first app** and enables **administrators** to track, manage, and resolve issues through a **web dashboard**.

---
URL: https://lovable.dev/projects/604cbf6f-d9cd-4104-b6d0-ea6bb8259679

## 🚀 Features

### 👤 Citizen Mobile App (Responsive, Mobile-first)
- 📍 Report civic issues with **photo/video + GPS location**
- 🎙️ Voice + text description (**multilingual support**)
- 📊 Track issue status: *Submitted → Acknowledged → In Progress → Resolved*
- 🏆 **Gamification**: earn points, badges, and leaderboard rankings
- 🌐 **Offline mode**: save reports & auto-upload when online
- 🔒 **Anonymous reporting** option for sensitive issues
- 🗺️ View **nearby issues** on an interactive map

### 🏢 Administrator Web Portal (Desktop-first)
- 📊 Dashboard with **summary statistics** of open / in-progress / resolved issues
- 🗂️ Assigned issues management: resolve, upload proof photos
- 🗺️ **Heatmap visualization** for ward/zone issue clustering
- 🤖 **AI-powered categorization & priority tagging**
- 👥 **User management**: monitor citizens and staff activity
- 📑 Export reports (**PDF / Excel**) for transparency & accountability

### 🔑 Authentication & Role-based Access
- Unified login system
- Role selection: **Citizen (mobile app)** or **Administrator (web portal)**

---

## 🛠️ Tech Stack
- **Frontend Framework:** Vite + React + TypeScript  
- **UI & Styling:** Tailwind CSS, Shadcn UI  
- **Backend:** Node.js (Express) or Python Flask *(choose based on your implementation)*  
- **Database:** MongoDB or MySQL / PostgreSQL  
- **Maps:** Google Maps API / OpenStreetMap  
- **AI Enhancements:** NLP for auto-categorization, ML for priority prediction  

---



#⚡ Installation & Setup
```bash
## 1. Clone the repository
git clone https://github.com/<your-username>/SheharFix.git
cd SheharFix
```
##2. Install dependencies

Using npm:
```bash
npm install

#or

yarn install
```
##3. Run development server
``` bash
npm run dev
# or
yarn dev
```
Open 👉 http://localhost:5173

##4.Build for production
```bash
npm run build
```
Backend Setup
```
cd backend
yarn install
yarn start
```

Machine Learning Service (ML)
```
cd C:\SheharFix\ml

# 1️⃣ Create virtual environment (if not already)
python -m venv .venv

# 2️⃣ Activate virtual environment
.venv\Scripts\Activate.ps1

# 3️⃣ Install dependencies
pip install -r requirements.txt
pip install fastapi uvicorn tensorflow pillow python-multipart

# 4️⃣ Start ML API
python app.py

```
Pull Latest Changes
```
git pull origin main

```
#📸 Screenshots

(Add screenshots/GIFs of your Citizen app & Admin dashboard here.)

#🛡️ Roadmap

✅ Role-based login

✅ Mobile-first citizen app

✅ Admin dashboard with analytics

🔲 AI-powered categorization

🔲 Push notifications (issue updates)

🔲 QR code-based ward entry

🔲 PDF/Excel exports and scheduled reports

🤝 Contributing

##Fork the repo

##Create a new branch:
```bash 
git checkout -b feature/new-feature
```

Commit your changes:
```
git commit -m "feat: add new feature"
```

Push and open a Pull Request

📜 License

MIT License © 2025 [Janhvi/CivicCrew]




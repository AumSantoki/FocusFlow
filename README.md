# FocusFlow 🎯
### Your personal habit tracker, daily to-do list & focus timer

![FocusFlow](https://img.shields.io/badge/FocusFlow-Live-brightgreen?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

---

## 🌐 Live Demo
👉 **[https://focus-flow-aumsantoki.vercel.app](https://focus-flow-aumsantoki.vercel.app)**

---

## 📖 About This Project

FocusFlow is a productivity web app that helps you build daily habits, manage tasks, track your progress and stay focused using a Pomodoro-style timer — all in one place.

This project was built as my **Final Project**, where I stepped outside my comfort zone. I only knew **HTML, CSS and basic JavaScript** before this. With the help of **AI tools (Claude by Anthropic and ChatGPT)**, I learned how to build a full React app, deploy it on the internet and manage code using Git and GitHub — all from scratch.

---

## ✨ Features

| Feature | Description |
|---|---|
| 👤 **Personalized Welcome** | Enter your name on first launch — shown on the home screen |
| 🌿 **Habit Tracker** | Add habits with custom colors, mark them daily, build streaks |
| 📝 **Daily To-Do List** | Add tasks with High / Medium / Low priority tags |
| 📈 **Analytics Dashboard** | 7-day bar chart, 30-day heatmap, streak progress bars |
| ⏱️ **Focus Timer** | Pomodoro timer (25/5/15 min) with custom duration support |
| 💾 **Data Persistence** | All data saved in localStorage — survives page refresh |
| 📤 **Export Data** | Download all your data as a JSON backup file |
| 📥 **Import Data** | Restore your data from a backup file |
| 📱 **PWA Support** | Install the app on mobile or desktop like a native app |
| ⚙️ **Settings Tab** | Edit name, manage data, danger zone to clear everything |

---

## 🎨 Design

The UI design was inspired by my own project **FlowBuddy** — a web app I had previously designed using plain HTML and CSS. Key design elements carried over:

- 🎨 Brand colors: **Flow Blue `#1a91d0`** and **Buddy Green `#64bc46`**
- ✨ Gradient text on headings and timer display
- 🃏 White rounded cards with soft blue shadows
- 💊 Habit pills that turn green when completed
- 🚢 Floating glass dock navigation at the bottom
- 🔤 **Plus Jakarta Sans** font throughout
- 📐 Responsive 3-column grid layout

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React** | Building the UI with components |
| **Vite** | Fast development server and build tool |
| **JavaScript (JSX)** | App logic and interactivity |
| **CSS-in-JS** | Styling written directly in JavaScript |
| **localStorage** | Saving user data in the browser |
| **PWA (manifest + service worker)** | Making the app installable |
| **Git** | Version control |
| **GitHub** | Storing code online |
| **Vercel** | Free hosting and deployment |

---

## 🤖 How AI Helped Me Build This

I came into this project knowing only **HTML, CSS and basic JavaScript**. I had never used React, JSX, npm, Git or any deployment tools before.

Here is honestly how AI tools helped me:

### 💬 Claude (by Anthropic)
- Designed and wrote the entire React app code based on my requirements
- Rebuilt the UI when I shared my FlowBuddy CSS/HTML design files
- Added features step by step — localStorage, export/import, PWA, username system
- Guided me through every error I faced in the terminal
- Fixed the PowerShell execution policy error
- Helped me understand what each file does (App.jsx, main.jsx, manifest.json, sw.js)
- Wrote this README file

### 💬 ChatGPT
- Helped me understand basic concepts about React and components
- Answered general questions about how web apps work
- Helped me understand what JSON files are

### 🧑‍💻 What I did myself
- Came up with the app idea and all the features
- Designed the original FlowBuddy UI (HTML + CSS) that inspired this app
- Shared my design files so the AI could match my vision
- Made all the decisions about colors, features and layout
- Followed every step to set up the project locally
- Fixed errors with AI guidance but executed everything myself
- Pushed the code to GitHub and deployed on Vercel
- Tested the app and verified everything worked

---

## 🚀 Run Locally

If you want to run this project on your own computer:

```bash
# 1. Clone the repository
git clone https://github.com/AumSantoki/FocusFlow.git

# 2. Go into the project folder
cd FocusFlow

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## 📁 Project Structure

```
focusflow/
├── public/
│   ├── manifest.json     → PWA configuration
│   ├── sw.js             → Service worker for offline support
│   └── favicon.svg
├── src/
│   ├── App.jsx           → Main app code (all components)
│   ├── main.jsx          → Entry point + service worker registration
│   ├── App.css           → (cleared — styling is in App.jsx)
│   └── index.css         → (cleared — styling is in App.jsx)
├── index.html            → HTML entry point
├── vite.config.js        → Vite configuration
└── package.json          → Project dependencies
```

---

## 📱 Install as App (PWA)

FocusFlow can be installed on your device like a native app:

- **Android (Chrome):** Tap the menu → "Add to Home Screen"
- **iPhone (Safari):** Tap Share → "Add to Home Screen"
- **Desktop (Chrome/Edge):** Click the install icon (⊕) in the address bar

---

## 👨‍💻 Made By

**Aum Santoki**
- GitHub: [@AumSantoki](https://github.com/AumSantoki)

---

## 🙏 Acknowledgements

- **Claude by Anthropic** — for building the app with me step by step
- **ChatGPT by OpenAI** — for helping me understand concepts
- **Vercel** — for free hosting
- **Google Fonts** — for Plus Jakarta Sans
- **My FlowBuddy project** — for the design inspiration
- **Gemini by Google** — for helping me understand concepts

---

> *"I didn't know React or deployment — but I had an idea, AI tools, and the determination to figure it out. Always Work with determination"*
> — Aum Santoki
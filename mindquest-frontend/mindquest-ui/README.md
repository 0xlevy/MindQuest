# MindQuest Frontend

MindQuest Frontend is a modern, responsive web application built with Next.js and TypeScript. It provides an interactive quiz experience, user dashboards, leaderboards, crypto rewards, and a vibrant Web3 community interface.

---

## 🚀 Features

- **Interactive Quizzes**: Take quizzes across multiple categories with instant feedback and scoring.
- **User Authentication**: Secure login, registration, and Google OAuth integration.
- **Dashboard**: Track your progress, points, rank, and achievements.
- **Leaderboards**: Compete with other users and view top performers.
- **Crypto Rewards**: Redeem points for cryptocurrency (integrated with backend).
- **Community**: Participate in discussions, ask questions, and connect with blockchain experts.
- **Admin Panel**: Manage categories, questions, and users (role-based access).
- **Responsive Design**: Optimized for desktop and mobile devices.

---

## 🛠 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (React)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context, SWR
- **Authentication**: JWT, OAuth2 (Google)
- **API**: RESTful endpoints from MindQuest Backend
- **Icons**: Lucide, Heroicons
- **Testing**: Jest, React Testing Library

---

## 📦 Project Structure

```
mindquest-frontend/
└── mindquest-ui/
    ├── components/      # Reusable UI components
    ├── pages/           # Next.js pages (routes)
    ├── app/             # App directory (Next.js 13+)
    ├── lib/             # API clients, hooks, utilities
    ├── public/          # Static assets
    ├── styles/          # Global styles
    ├── tests/           # Unit and integration tests
    └── README.md        # This file
```

---

## ⚡ Quick Start

### 1. Install dependencies

```bash
npm install
# or
yarn install
```

### 2. Configure environment variables

Create a `.env.local` file in `mindquest-ui/`:

```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

### 3. Run the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔗 API Integration

- The frontend communicates with the backend via RESTful APIs.
- All API endpoints are configured via `NEXT_PUBLIC_API_URL`.
- Authentication tokens are stored in cookies/localStorage and sent with requests.

---

## 🧑‍💻 Contributing

1. Fork the repository and create a feature branch.
2. Write clear, maintainable code and add tests.
3. Run `npm run lint` and `npm run test` before submitting a PR.
4. Submit a pull request with a clear description of your changes.

---

## 🧪 Testing

- Run unit and integration tests:
  ```bash
  npm run test
  ```
- Coverage reports are generated in the `coverage/` directory.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](../../LICENSE) file for details.

---

## 🙏 Acknowledgments

- Thanks to the open-source community for frameworks and libraries.
- Special thanks to contributors and testers.

---

**MindQuest Frontend** — Empowering minds through interactive learning and Web3
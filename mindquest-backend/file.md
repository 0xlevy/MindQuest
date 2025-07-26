## 🌐 How the Frontend Communicates with the Backend

MindQuest Frontend interacts with the backend via RESTful API endpoints. All data—such as quizzes, user profiles, leaderboards, rewards, and community posts—is fetched or updated by making HTTP requests to the backend server.

### API Base URL

The base URL for all API requests is set in the `.env.local` file:

```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### Example Communication Flow

1. **User Authentication**
   - On login or registration, the frontend sends a POST request to `/auth/login` or `/auth/register`.
   - The backend responds with a JWT token, which is stored in cookies or localStorage.

2. **Fetching Quiz Categories**
   - The frontend requests `/quiz/categories` to get available quiz categories.
   - The backend returns a list of categories, which are displayed to the user.

3. **Taking a Quiz**
   - When a user starts a quiz, the frontend fetches quiz questions from `/quiz/{categoryId}`.
   - User answers are submitted via POST to `/quiz/{categoryId}/submit`.

4. **User Profile and Progress**
   - The frontend requests `/user/profile` and `/user/points` to display user stats and progress.

5. **Rewards and Leaderboard**
   - Available rewards are fetched from `/rewards/available`.
   - Leaderboard data is fetched from `/leaderboard`.

6. **Community Features**
   - Posts and discussions are managed via `/community/posts` and related endpoints.

### Authentication

- JWT tokens are included in the `Authorization` header for protected endpoints:
  ```
  Authorization: Bearer <token>
  ```
- The frontend automatically attaches the token to requests after login.

### Error Handling

- API errors are caught and displayed to the user with helpful messages.
- If authentication fails, the user is redirected to the login page.

### Example API Call (using fetch)

```typescript
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quiz/categories`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
const data = await response.json();
```

### Summary

- All frontend data is dynamic and comes from backend APIs.
- Environment variables control the API endpoint.
- Authentication and user state are managed via JWT tokens.
- The frontend is decoupled from the backend, allowing for flexible deployment.

**MindQuest Frontend** is designed for seamless, secure, and scalable communication with
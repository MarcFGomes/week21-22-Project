# JobTrackr

A full-stack web application to track and manage job applications in one place. Users can create, update, and delete applications, monitor their status, and keep notes and links for each opportunity.

---

## Features

- User authentication (JWT-based)
- Add job applications
- Edit existing applications
- Delete applications
- Track application status:
  - Applied
  - Interview
  - Offer
  - Rejected
- Store additional details:
  - Notes
  - Job link
  - Application date
- Responsive UI with Bootstrap
- Persistent data using MongoDB

---

## Tech Stack

### Frontend
- React (Vite)
- React Router
- Apollo Client
- Bootstrap
- js-cookie (authentication handling)

### Backend
- Node.js
- Express.js (middleware layer)
- Apollo Server (GraphQL API)
- MongoDB with Mongoose
- JWT authentication

---

## Architecture

```bash
Client (React + Apollo)
        ↓
GraphQL API (Apollo Server)
        ↓
MongoDB (Mongoose)
```

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/jobtrackr.git
cd jobtrackr
```

---

### 2. Install dependencies

#### Server

```bash
cd server
npm install
```

#### Client

```bash
cd ../client
npm install
```

---

### 3. Environment variables

Create a `.env` file in the `server` folder:

```bash
MONGODB_URI=mongodb://127.0.0.1:27017/jobtrackr
JWT_SECRET=your_secret_key
```

---

### 4. Run the app

```bash
npm run dev
```

---

## Usage

1. Sign up or log in
2. Add a job application
3. Track its status and details
4. Edit or delete applications as needed

---

## GraphQL API

### Queries

- `me` → returns current user and applications

### Mutations

- `addUser`
- `login`
- `addApplication`
- `updateApplication`
- `removeApplication`

---

## Example Mutation

```bash
mutation {
  addApplication(
    company: "Google"
    role: "Software Engineer"
    status: "Applied"
    notes: "Referral submitted"
  ) {
    applications {
      _id
      company
      role
    }
  }
}
```

---

## Project Structure

```code
client/
  src/
    components/
    pages/
    utils/
server/
  models/
  schemas/
  utils/
  config/
```

---

## Deployment Notes

- Frontend can be deployed on Netlify or Vercel
- Backend can be deployed on Render or similar
- Update API URL accordingly in production
- Enable CORS or use proxy depending on setup

---

## Future Improvements

- Filtering and sorting applications
- Dashboard analytics (conversion rate, pipeline)
- Notifications/reminders
- File attachments (resume, cover letter)
- Calendar integration

---

## Author

Marc Gomes

---

## License

MIT License

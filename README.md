# Blog Project

This project contains both a **Frontend** (Next.js) and a **Backend** (Node.js/Express) application.

## Project Structure

```
Blog/
├── Frontend/   # Next.js app
├── Backend/    # Node.js/Express app
├── README.md
├── .gitignore
├── package.json  # Root package for running both apps
└── ...
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd Blog
```

### 2. Install dependencies

#### Option 1: Install all dependencies at once
```bash
npm run install-deps
```

#### Option 2: Install dependencies separately

##### Frontend
```bash
cd Frontend
npm install
```

##### Backend
```bash
cd ../Backend
npm install
```

### 3. Run the development servers

#### Option 1: Run both servers with a single command
```bash
npm start
```

#### Option 2: Run servers separately

##### Frontend (Next.js)
```bash
cd Frontend
npm run dev
```

##### Backend (Express)
```bash
cd Backend
npm start
```

---

## Usage
- Frontend: Open [http://localhost:3000](http://localhost:3000) in your browser.
- Backend: By default, runs on [http://localhost:5000](http://localhost:5000) (or as configured).

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Express Documentation](https://expressjs.com/)

---
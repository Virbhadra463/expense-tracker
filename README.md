# Expense Tracker (College mini-project)

A full-stack personal finance web app to track expenses, manage monthly budgets, and resist impulse purchases with a built-in 24-hour cooldown system.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Tailwind CSS |
| Backend | Python( Django ), SQLite |

---

## Features

- **Dashboard** — View spending by category, trends, and top expenses
- **Expense Management** — Add, edit, delete expenses with date filtering
- **Monthly Budget** — Set a monthly salary/pocket money and track how much you've spent
- **Impulse Buy Tracker** — Log potential impulse purchases, let them cool down for 24h, then decide whether to buy or skip
  - Each item shows how many **hours of work** it costs relative to your salary
  - Motivational nudges rotate every 5 seconds
  - Saves money tracking when you resist a purchase
---

## Project Structure

```
expense_tracker/
├── backend/                  # Django backend
│   ├── backend/              # Django project settings & URLs
│   └── expense/              # Main app: models, views, URLs, migrations
├── frontend/                 # React frontend
│   ├── public/               # Static HTML assets
│   └── src/
│       ├── components/       # UI components (Navbar, HomePage, Dashboard)
│       ├── hooks/            # useExpenses, useUrges custom hooks
│       └── services/         # API service layer (expenseService, impulseService)
└── .gitignore
```

---

### Backend Setup

First, navigate to the backend directory and set up a Python virtual environment:

```bash
cd backend

# Create a virtual environment
python -m venv venv

# Activate it (Windows)
venv\Scripts\activate
# Or on Mac/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations and start the server
python manage.py migrate
python manage.py runserver
```

Backend runs at: `http://127.0.0.1:8000`

### Admin Panel Setup

To manage your database easily, create an admin superuser account:

```bash
python manage.py createsuperuser
```
Follow the prompts to set your username, email, and password.

Then, start the server and navigate to the admin panel in your browser:  
👉 `http://127.0.0.1:8000/admin/`

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs at: `http://localhost:3000`

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/signup/` | Register a new user |
| POST | `/api/login/` | Login |
| GET | `/api/get_expenses/?user_id=` | Fetch all expenses |
| POST | `/api/add_expense/` | Add an expense |
| PUT | `/api/update_expense/<id>/` | Edit an expense |
| POST | `/api/delete_expenses/` | Delete expenses by IDs |
| PUT | `/api/update_salary/<user_id>/` | Update monthly budget |
| POST | `/api/add_impulse/` | Log an impulse buy |
| GET | `/api/get_impulses/?user_id=` | Fetch all impulse buys |
| PUT | `/api/update_impulse/<id>/` | Update impulse status |
| DELETE | `/api/delete_impulse/<id>/` | Delete an impulse buy |

---

## Database Models

### `UserDetail`
Stores user profile: name, email, password, gender, birth date, monthly salary.

### `Expense`
Stores individual expenses: category, amount, description, date, linked to a user.

### `ImpulseBuy`
Stores impulse purchase attempts: name, amount, category, note, status (`pending` / `bought` / `discarded`), and a 24h expiry timestamp.

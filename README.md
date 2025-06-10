# Task Manager Application

A full-stack task management application built with FastAPI, PostgreSQL, and a simple frontend.

## Features

- User authentication with JWT tokens
- CRUD operations for tasks
- Secure endpoints with user authorization
- PostgreSQL database with SQLAlchemy ORM
- Docker containerization
- CI/CD with GitHub Actions
- Simple and responsive frontend

## Prerequisites

- Docker and Docker Compose
- Python 3.11+
- PostgreSQL (if running locally)

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd task-manager
```

2. Create a `.env` file in the root directory with the following variables:
```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_DB=taskmanager
SECRET_KEY=your-secret-key-here
```

3. Start the application using Docker Compose:
```bash
docker-compose up --build
```

4. Access the application:
- Backend API: http://localhost:8000
- Frontend: Open `frontend/index.html` in your browser
- API Documentation: http://localhost:8000/docs

## API Endpoints

- `POST /register` - Register a new user
- `POST /login` - Login and get JWT token
- `GET /me` - Get current user information
- `POST /tasks` - Create a new task
- `GET /tasks` - Get all tasks for the current user
- `GET /tasks/{task_id}` - Get a specific task
- `PUT /tasks/{task_id}` - Update a task
- `DELETE /tasks/{task_id}` - Delete a task

## Development

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run tests:
```bash
pytest
```

3. Run the development server:
```bash
uvicorn app.main:app --reload
```

## Project Structure

```
task-manager/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── database.py
│   ├── auth.py
│   └── config.py
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── app.js
├── tests/
│   └── test_main.py
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── README.md
```

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Protected endpoints with user authorization
- Secure database connections
- Environment variable configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License. 
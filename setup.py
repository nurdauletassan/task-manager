from setuptools import setup, find_packages

setup(
    name="task-manager",
    version="0.1",
    packages=find_packages(),
    install_requires=[
        "fastapi",
        "uvicorn",
        "sqlalchemy",
        "psycopg2-binary",
        "python-jose[cryptography]",
        "passlib[bcrypt]",
        "python-multipart",
        "pydantic",
        "pydantic-settings",
        "alembic",
        "pytest",
        "httpx",
        "email-validator",
    ],
) 
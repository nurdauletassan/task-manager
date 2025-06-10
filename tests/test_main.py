from fastapi.testclient import TestClient
import pytest

def test_create_user(client):
    response = client.post(
        "/register",
        json={"email": "test@example.com", "username": "testuser", "password": "testpass"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["username"] == "testuser"
    assert "id" in data

def test_login(client):
    # First create a user
    client.post(
        "/register",
        json={"email": "test@example.com", "username": "testuser", "password": "testpass"}
    )
    
    # Then try to login
    response = client.post(
        "/login",
        data={"username": "testuser", "password": "testpass"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_create_task(client):
    # First create a user
    client.post(
        "/register",
        json={"email": "test@example.com", "username": "testuser", "password": "testpass"}
    )
    
    # Then login to get token
    login_response = client.post(
        "/login",
        data={"username": "testuser", "password": "testpass"}
    )
    token = login_response.json()["access_token"]
    
    # Create task with token
    response = client.post(
        "/tasks",
        json={"title": "Test Task", "description": "Test Description"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Task"
    assert data["description"] == "Test Description" 
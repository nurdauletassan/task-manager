const API_URL = 'http://localhost:8000';
let token = localStorage.getItem('token');

// Функции для переключения между формами
function showLogin() {
    document.querySelectorAll('.auth-container')[0].style.display = 'block';
    document.querySelectorAll('.auth-container')[1].style.display = 'none';
}

function showRegister() {
    document.querySelectorAll('.auth-container')[0].style.display = 'none';
    document.querySelectorAll('.auth-container')[1].style.display = 'block';
}

// Функция выхода
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    token = null;
    showAuthSection();
}

// Показ/скрытие секций
function showAuthSection() {
    document.getElementById('authSection').style.display = 'block';
    document.getElementById('taskSection').style.display = 'none';
    document.getElementById('userInfo').style.display = 'none';
}

function showTaskSection() {
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('taskSection').style.display = 'block';
    document.getElementById('userInfo').style.display = 'block';
    document.getElementById('userEmail').textContent = localStorage.getItem('userEmail');
    loadTasks();
}

// Проверка авторизации при загрузке
function checkAuth() {
    if (token) {
        showTaskSection();
    } else {
        showAuthSection();
    }
}

// Обработчики форм
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            token = data.access_token;
            localStorage.setItem('token', token);
            localStorage.setItem('userEmail', username);
            showTaskSection();
        } else {
            const error = await response.json();
            alert('Ошибка входа: ' + (error.detail || 'Неверное имя пользователя или пароль'));
        }
    } catch (error) {
        alert('Ошибка при входе: ' + error.message);
    }
});

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;

    // Проверка паролей
    if (password !== passwordConfirm) {
        alert('Пароли не совпадают!');
        return;
    }

    // Проверка длины пароля
    if (password.length < 6) {
        alert('Пароль должен быть не менее 6 символов!');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        if (response.ok) {
            alert('Регистрация успешна! Теперь вы можете войти.');
            showLogin();
            // Очищаем форму
            document.getElementById('registerForm').reset();
        } else {
            const error = await response.json();
            alert('Ошибка регистрации: ' + (error.detail || 'Неизвестная ошибка'));
        }
    } catch (error) {
        alert('Ошибка при регистрации: ' + error.message);
    }
});

document.getElementById('taskForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;

    try {
        const response = await fetch(`${API_URL}/tasks/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, description })
        });

        if (response.ok) {
            document.getElementById('taskForm').reset();
            loadTasks();
        } else {
            const error = await response.json();
            alert('Ошибка создания задачи: ' + (error.detail || 'Неизвестная ошибка'));
        }
    } catch (error) {
        alert('Ошибка при создании задачи: ' + error.message);
    }
});

// Загрузка задач
async function loadTasks() {
    try {
        const response = await fetch(`${API_URL}/tasks/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const tasks = await response.json();
            const taskList = document.getElementById('taskList');
            taskList.innerHTML = '';

            tasks.forEach(task => {
                const taskElement = document.createElement('div');
                taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
                taskElement.innerHTML = `
                    <div class="task-content">
                        <h3>${task.title}</h3>
                        <p>${task.description}</p>
                    </div>
                    <div class="task-actions">
                        <button onclick="toggleTask(${task.id}, ${!task.completed})" class="btn btn-secondary">
                            ${task.completed ? 'Отметить как невыполненную' : 'Отметить как выполненную'}
                        </button>
                        <button onclick="deleteTask(${task.id})" class="btn btn-danger">Удалить</button>
                    </div>
                `;
                taskList.appendChild(taskElement);
            });
        } else if (response.status === 401) {
            // Если токен истек, выходим из системы
            logout();
            alert('Сессия истекла. Пожалуйста, войдите снова.');
        } else {
            const error = await response.json();
            alert('Ошибка загрузки задач: ' + (error.detail || 'Неизвестная ошибка'));
        }
    } catch (error) {
        alert('Ошибка при загрузке задач: ' + error.message);
    }
}

// Обновление статуса задачи
async function toggleTask(id, completed) {
    try {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ completed })
        });

        if (response.ok) {
            loadTasks();
        } else {
            const error = await response.json();
            alert('Ошибка обновления задачи: ' + (error.detail || 'Неизвестная ошибка'));
        }
    } catch (error) {
        alert('Ошибка при обновлении задачи: ' + error.message);
    }
}

// Удаление задачи
async function deleteTask(id) {
    if (!confirm('Вы уверены, что хотите удалить эту задачу?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            loadTasks();
        } else {
            const error = await response.json();
            alert('Ошибка удаления задачи: ' + (error.detail || 'Неизвестная ошибка'));
        }
    } catch (error) {
        alert('Ошибка при удалении задачи: ' + error.message);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', checkAuth); 
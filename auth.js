function isAdmin() {
    return localStorage.getItem('currentUser') === 'admin';
}
function showAdminPanel() {
    const panel = document.getElementById('admin-panel');
    if (panel) panel.style.display = 'block';
}
function hideAdminPanel() {
    const panel = document.getElementById('admin-panel');
    if (panel) panel.style.display = 'none';
}
document.addEventListener('DOMContentLoaded', () => {
    // Вхід/реєстрація
    document.getElementById('auth-form').onsubmit = function(e) {
        e.preventDefault();
        const username = document.getElementById('auth-username').value.trim();
        const password = document.getElementById('auth-password').value;
        if (!username || !password) return;
        let users = JSON.parse(localStorage.getItem('users')) || {};
        if (!users[username]) {
            users[username] = password;
        }
        if (users[username] === password) {
            localStorage.setItem('currentUser', username);
            localStorage.setItem('users', JSON.stringify(users));
            if (username === 'admin') showAdminPanel();
            else hideAdminPanel();
            alert('Вхід успішний!');
            window.location.href = 'animals.html';
        } else {
            alert('Невірний пароль!');
        }
    };
    // Перевірка адміна при завантаженні
    if (isAdmin()) showAdminPanel();
    else hideAdminPanel();
    // Вихід з адмін-панелі
    document.getElementById('logout-btn').onclick = function() {
        localStorage.removeItem('currentUser');
        hideAdminPanel();
    };
    // Додавання тварини (адмін)
    document.getElementById('add-animal-form').onsubmit = function(e) {
        e.preventDefault();
        const name = document.getElementById('animal-name').value.trim();
        const desc = document.getElementById('animal-desc').value.trim();
        const img = document.getElementById('animal-img').value.trim();
        if (!name || !desc || !img) return;
        const animals = JSON.parse(localStorage.getItem('animals')) || [];
        animals.push({ name, desc, img });
        localStorage.setItem('animals', JSON.stringify(animals));
        this.reset();
        alert('Тварину додано!');
    };
}); 
// --- Дані та ініціалізація ---
const defaultAnimals = [
    { name: 'Барсик', img: 'cat1.png', desc: 'Дружній кіт, 2 роки. Любить гратися.' },
    { name: 'Рекс', img: 'dog1.png', desc: 'Веселий пес, 3 роки. Обожнює прогулянки.' },
    { name: 'Мурка', img: 'cat2.png', desc: 'Лагідна кішка, 1 рік. Шукає дім.' }
];

function getAnimals() {
    return JSON.parse(localStorage.getItem('animals')) || defaultAnimals;
}
function setAnimals(arr) {
    localStorage.setItem('animals', JSON.stringify(arr));
}

// --- Рендер тварин ---
function renderAnimals() {
    const list = document.querySelector('.animal-list');
    list.innerHTML = '';
    getAnimals().forEach((animal, idx) => {
        const card = document.createElement('div');
        card.className = 'animal-card';
        card.innerHTML = `
            <img src="${animal.img}" alt="${animal.name}">
            <h3>${animal.name}</h3>
            <p>${animal.desc}</p>
        `;
        card.addEventListener('click', () => openAnimalModal(idx));
        list.appendChild(card);
    });
}

// --- Модальне вікно тварини ---
function openAnimalModal(idx) {
    const modal = document.getElementById('animal-modal');
    const animals = getAnimals();
    const animal = animals[idx];
    document.getElementById('modal-img').src = animal.img;
    document.getElementById('modal-name').textContent = animal.name;
    document.getElementById('modal-desc').textContent = animal.desc;
    const delBtn = document.getElementById('delete-animal-btn');
    if (isAdmin()) {
        delBtn.style.display = 'inline-block';
        delBtn.onclick = function() {
            animals.splice(idx, 1);
            setAnimals(animals);
            closeAnimalModal();
            renderAnimals();
        };
    } else {
        delBtn.style.display = 'none';
    }
    modal.classList.add('show');
}
function closeAnimalModal() {
    document.getElementById('animal-modal').classList.remove('show');
}

// --- Аутентифікація ---
function isAdmin() {
    return localStorage.getItem('currentUser') === 'admin';
}
function showAdminPanel() {
    document.getElementById('admin-panel').style.display = 'block';
}
function hideAdminPanel() {
    document.getElementById('admin-panel').style.display = 'none';
}
function showAuthSection() {
    document.getElementById('auth-section').style.display = 'block';
}
function hideAuthSection() {
    document.getElementById('auth-section').style.display = 'none';
}

// --- Події ---
document.addEventListener('DOMContentLoaded', () => {
    renderAnimals();

    // Модалка тварини
    document.querySelector('.close-modal').onclick = closeAnimalModal;
    document.getElementById('animal-modal').onclick = e => {
        if (e.target.classList.contains('modal')) closeAnimalModal();
    };

    // Вхід/реєстрація
    document.getElementById('auth-link').onclick = e => {
        e.preventDefault();
        showAuthSection();
    };
    document.getElementById('close-auth').onclick = hideAuthSection;
    document.getElementById('auth-form').onsubmit = function(e) {
        e.preventDefault();
        const username = document.getElementById('auth-username').value.trim();
        const password = document.getElementById('auth-password').value;
        if (!username || !password) return;
        // Реєстрація/логін
        let users = JSON.parse(localStorage.getItem('users')) || {};
        if (!users[username]) {
            users[username] = password;
        }
        if (users[username] === password) {
            localStorage.setItem('currentUser', username);
            localStorage.setItem('users', JSON.stringify(users));
            hideAuthSection();
            if (username === 'admin') showAdminPanel();
            else hideAdminPanel();
            alert('Вхід успішний!');
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
        const animals = getAnimals();
        animals.push({ name, desc, img });
        setAnimals(animals);
        renderAnimals();
        this.reset();
    };
}); 
document.addEventListener("DOMContentLoaded", () => {
    const animalList = document.getElementById("animal-list");
    const addForm = document.getElementById("add-animal-form");
    const adminPanel = document.getElementById("admin-panel");
    const filterBtns = document.querySelectorAll('.filter-btn');
    let isAdmin = false;
    let filterType = "all";
    let currentUser = {};
    try {
        const cu = localStorage.getItem("currentUser");
        if (cu && cu.trim().startsWith("{")) {
            currentUser = JSON.parse(cu);
        } else {
            currentUser = {};
        }
    } catch (e) {
        currentUser = {};
    }
    if (currentUser && currentUser.login === "admin") {
        isAdmin = true;
        if (adminPanel) adminPanel.style.display = "block";
    } else {
        if (adminPanel) adminPanel.style.display = "none";
    }

    // --- LocalStorage helpers ---
    function getAnimals() {
        return JSON.parse(localStorage.getItem("animals") || "[]");
    }
    function saveAnimals(animals) {
        localStorage.setItem("animals", JSON.stringify(animals));
    }

    // --- Додати стартових тварин, якщо LocalStorage порожній ---
    if (!localStorage.getItem("animals")) {
        saveAnimals([
            {
                name: 'Барсик',
                image: 'cat5.png',
                description: 'Дружній кіт, 2 роки. Любить гратися.',
                type: 'Кіт',
                age: '2 роки',
                gender: 'Самець',
                health: 'Вакцинований, кастрований'
            },
            {
                name: 'Рекс',
                image: 'dog5.png',
                description: 'Веселий пес, 3 роки. Обожнює прогулянки.',
                type: 'Собака',
                age: '3 роки',
                gender: 'Самець',
                health: 'Вакцинований'
            },
            {
                name: 'Мурка',
                image: 'cat1.png',
                description: 'Лагідна кішка, 1 рік. Шукає дім.',
                type: 'Кіт',
                age: '1 рік',
                gender: 'Самка',
                health: 'Стерилізована'
            },
            {
                name: 'Сніжок',
                image: 'cat10.png',
                description: 'Білий пухнастик, 3 роки. Дуже лагідний.',
                type: 'Кіт',
                age: '3 роки',
                gender: 'Самець',
                health: 'Вакцинований'
            },
            {
                name: 'Джек',
                image: 'dog11.png',
                description: 'Молодий активний пес, 1.5 роки.',
                type: 'Собака',
                age: '1.5 роки',
                gender: 'Самець',
                health: 'Вакцинований'
            },
            {
                name: 'Люся',
                image: 'cat7.png',
                description: 'Кішка з яскравими очима, 4 роки.',
                type: 'Кіт',
                age: '4 роки',
                gender: 'Самка',
                health: 'Стерилізована'
            },
            {
                name: 'Том',
                image: 'cat3.png',
                description: 'Сірий кіт, 2.5 роки. Любить обійми.',
                type: 'Кіт',
                age: '2.5 роки',
                gender: 'Самець',
                health: 'Вакцинований'
            },
            {
                name: 'Лакі',
                image: 'dog15.png',
                description: 'Собака-компаньйон, 5 років.',
                type: 'Собака',
                age: '5 років',
                gender: 'Самець',
                health: 'Вакцинований, кастрований'
            },
            {
                name: 'Мілка',
                image: 'cat14.png',
                description: 'Маленька кішечка, 7 місяців.',
                type: 'Кіт',
                age: '7 місяців',
                gender: 'Самка',
                health: 'Вакцинована'
            },
            {
                name: 'Граф',
                image: 'dog6.png',
                description: 'Серйозний охоронець, 6 років.',
                type: 'Собака',
                age: '6 років',
                gender: 'Самець',
                health: 'Вакцинований'
            }
        ]);
    }

    // --- Фільтрація ---
    function setActiveFilter(btnId) {
        filterBtns.forEach(btn => btn.classList.remove('active'));
        document.getElementById(btnId).classList.add('active');
    }
    document.getElementById("filter-all").onclick = () => { filterType = "all"; setActiveFilter("filter-all"); renderAnimals(); };
    document.getElementById("filter-cats").onclick = () => { filterType = "Кіт"; setActiveFilter("filter-cats"); renderAnimals(); };
    document.getElementById("filter-dogs").onclick = () => { filterType = "Собака"; setActiveFilter("filter-dogs"); renderAnimals(); };

    // --- Рендер тварин ---
    function renderAnimals() {
        animalList.innerHTML = "";
        getAnimals().forEach((animal, idx) => {
            if (filterType !== "all" && animal.type !== filterType) return;
            const div = document.createElement("div");
            div.className = "animal-card";
            div.innerHTML = `
                <img src="${animal.image}" alt="${animal.name}">
                <h3>${animal.name}</h3>
                <p><b>Порода:</b> ${animal.breed || ''}</p>
                <p>${animal.description}</p>
                ${isAdmin ? `
                    <button class="admin-btn edit-btn">Редагувати</button>
                    <button class="admin-btn delete-btn">Видалити</button>
                ` : ""}
            `;
            // Відкрити модалку з детальною інформацією
            div.onclick = (e) => {
                if (e.target.classList.contains("edit-btn") || e.target.classList.contains("delete-btn")) return;
                showInfoModal(animal);
            };
            if (isAdmin) {
                div.querySelector(".edit-btn").onclick = (e) => { e.stopPropagation(); openEditForm(idx, animal); };
                div.querySelector(".delete-btn").onclick = (e) => {
                    e.stopPropagation();
                    if (confirm("Видалити тварину?")) {
                        const animals = getAnimals();
                        animals.splice(idx, 1);
                        saveAnimals(animals);
                        renderAnimals();
                    }
                };
            }
            animalList.appendChild(div);
        });
    }

    // --- Додавання тварини з фото ---
    addForm.onsubmit = e => {
        e.preventDefault();
        const fileInput = addForm.querySelector('input[type="file"]');
        const file = fileInput.files[0];
        if (!file) return alert("Оберіть фото!");
        const reader = new FileReader();
        reader.onload = function(evt) {
            const animals = getAnimals();
            animals.push({
                name: addForm.name.value,
                image: evt.target.result,
                breed: addForm.breed ? addForm.breed.value : '',
                description: addForm.description.value,
                type: addForm.querySelector('[name="type"]') ? addForm.querySelector('[name="type"]').value : "Кіт",
                age: addForm.querySelector('[name="age"]') ? addForm.querySelector('[name="age"]').value : "",
                gender: addForm.querySelector('[name="gender"]') ? addForm.querySelector('[name="gender"]').value : "",
                health: addForm.querySelector('[name="health"]') ? addForm.querySelector('[name="health"]').value : ""
            });
            saveAnimals(animals);
            addForm.reset();
            renderAnimals();
        };
        reader.readAsDataURL(file);
    };

    // --- Модалка для детальної інформації (info-modal) ---
    function showInfoModal(animal) {
        document.getElementById("info-img").src = animal.image;
        document.getElementById("info-name").textContent = animal.name;
        document.getElementById("info-desc").textContent = animal.description;
        document.getElementById("info-breed").textContent = animal.breed || '';
        document.getElementById("info-type").textContent = animal.type;
        document.getElementById("info-age").textContent = animal.age;
        document.getElementById("info-gender").textContent = animal.gender;
        document.getElementById("info-health").textContent = animal.health;
        document.getElementById("info-modal").style.display = "flex";
        // --- Кнопка "Забрати" ---
        let adoptBtnInfo = document.getElementById('adopt-btn-info');
        if (!adoptBtnInfo) {
            adoptBtnInfo = document.createElement('button');
            adoptBtnInfo.id = 'adopt-btn-info';
            adoptBtnInfo.className = 'btn btn-primary';
            adoptBtnInfo.style.marginTop = '12px';
            document.querySelector('#info-modal > div').appendChild(adoptBtnInfo);
        }
        let user = localStorage.getItem('currentUser');
        try { user = JSON.parse(user); } catch(e) {}
        if (!user) {
            adoptBtnInfo.textContent = 'Увійдіть, щоб забрати';
            adoptBtnInfo.disabled = true;
            return;
        }
        adoptBtnInfo.disabled = false;
        let adopted = JSON.parse(localStorage.getItem('adopted_' + user) || '[]');
        const isInCart = adopted.some(a => a.name === animal.name && a.description === animal.description);
        adoptBtnInfo.textContent = isInCart ? 'Вже у кошику' : 'Забрати';
        adoptBtnInfo.onclick = function() {
            if (!isInCart) {
                adopted.push(animal);
                localStorage.setItem('adopted_' + user, JSON.stringify(adopted));
            }
            document.getElementById("info-modal").style.display = "none";
        };
    }
    document.getElementById("close-info").onclick = () => {
        document.getElementById("info-modal").style.display = "none";
    };

    // --- Редагування тварини ---
    const editModal = document.getElementById("edit-modal");
    const editForm = document.getElementById("edit-form");
    const cancelEditBtn = document.getElementById("cancel-edit");
    let editIdx = null;
    let currentEditImage = "";
    function openEditForm(idx, animal) {
        editIdx = idx;
        editForm["edit-name"].value = animal.name;
        editForm["edit-description"].value = animal.description;
        currentEditImage = animal.image;
        editForm["edit-image-file"].value = "";
        editModal.style.display = "flex";
    }
    editForm.onsubmit = e => {
        e.preventDefault();
        const animals = getAnimals();
        const fileInput = editForm.querySelector('input[name="edit-image-file"]');
        const file = fileInput.files[0];
        function saveAndClose(image) {
            animals[editIdx] = {
                name: editForm["edit-name"].value,
                image: image,
                description: editForm["edit-description"].value,
                type: animals[editIdx].type,
                age: animals[editIdx].age,
                gender: animals[editIdx].gender,
                health: animals[editIdx].health
            };
            saveAnimals(animals);
            editModal.style.display = "none";
            renderAnimals();
        }
        if (file) {
            const reader = new FileReader();
            reader.onload = function(evt) {
                saveAndClose(evt.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            saveAndClose(currentEditImage);
        }
    };
    cancelEditBtn.onclick = () => {
        editModal.style.display = "none";
    };

    // Захист для кнопки входу адміна
    const adminLoginBtn = document.getElementById("admin-login-btn");
    if (adminLoginBtn) {
        adminLoginBtn.onclick = () => {
            const adminLoginForm = document.getElementById("admin-login-form");
            if (adminLoginForm) {
                adminLoginForm.style.display = "block";
                adminLoginBtn.style.display = "none";
            }
        };
    }
    const adminSubmit = document.getElementById("admin-submit");
    if (adminSubmit) {
        adminSubmit.onclick = (e) => {
            e.preventDefault();
            const loginInput = document.getElementById("admin-login");
            const passInput = document.getElementById("admin-password");
            if (!loginInput || !passInput) return;
            const login = loginInput.value;
            const pass = passInput.value;
            if (login === "admin" && pass === "admin") {
                isAdmin = true;
                if (adminPanel) adminPanel.style.display = "block";
                const adminLoginForm = document.getElementById("admin-login-form");
                if (adminLoginForm) adminLoginForm.style.display = "none";
                renderAnimals();
            } else {
                alert("Невірний логін або пароль!");
            }
        };
    }

    renderAnimals();
});

console.log('🎉 З\'єднання з MongoDB встановлено успішно!');

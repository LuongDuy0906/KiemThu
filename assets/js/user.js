/* ================================================
   LOAD DATA FROM JSON (FIRST RUN) + LOCAL STORAGE
================================================ */
let users = [];
let itemsPerPage = 8;
let currentPage = 1;
let editingId = null;

async function loadUsers() {
    const stored = localStorage.getItem("users");

    if (stored) {
        return JSON.parse(stored);
    }

    // Nếu chưa có dữ liệu -> đọc từ JSON
    try {
        const res = await fetch("data/users.json");
        if (!res.ok) throw new Error("Không tìm thấy users.json");

        const json = await res.json();
        localStorage.setItem("users", JSON.stringify(json));
        return json;
    } catch (err) {
        console.error("Lỗi load users.json:", err);
        localStorage.setItem("users", JSON.stringify([]));
        return [];
    }
}

function saveData() {
    localStorage.setItem("users", JSON.stringify(users));
}

/* ================================================
   RENDER TABLE
================================================ */
function renderTable(page = 1) {
    const tbody = document.getElementById("userTableBody");
    tbody.innerHTML = "";

    const start = (page - 1) * itemsPerPage;
    const list = users.slice(start, start + itemsPerPage);

    list.forEach(u => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${u.id}</td>
            <td>${u.username}</td>
            <td>${u.password}</td>
            <td>${u.name}</td>
            <td>${u.phone}</td>
            <td>
                <button class="btn btn-primary" onclick="openEditPopup(${u.id})">Sửa</button>
                <button class="btn btn-danger" onclick="deleteUser(${u.id})">Xóa</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    renderPagination();
}

/* ================================================
   PAGINATION
================================================ */
function renderPagination() {
    const totalPages = Math.ceil(users.length / itemsPerPage);
    const container = document.getElementById("pagination");
    container.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.className = "page-btn";
        btn.textContent = i;
        btn.onclick = () => {
            currentPage = i;
            renderTable(currentPage);
        };
        container.appendChild(btn);
    }
}

/* ================================================
   ADD USER POPUP
================================================ */
function openAddPopup() {
    document.getElementById("popupAdd").style.display = "flex";
}
function closeAddPopup() {
    document.getElementById("popupAdd").style.display = "none";
}

function addUser() {
    const u = {
        id: users.length ? Math.max(...users.map(x => x.id)) + 1 : 1,
        username: document.getElementById("add_username").value,
        password: document.getElementById("add_password").value,
        name: document.getElementById("add_name").value,
        phone: document.getElementById("add_phone").value
    };

    users.push(u);
    saveData();
    closeAddPopup();
    renderTable(currentPage);
}

/* ================================================
   EDIT USER POPUP
================================================ */
function openEditPopup(id) {
    const u = users.find(x => x.id === id);
    editingId = id;

    document.getElementById("edit_username").value = u.username;
    document.getElementById("edit_password").value = u.password;
    document.getElementById("edit_name").value = u.name;
    document.getElementById("edit_phone").value = u.phone;

    document.getElementById("popupEdit").style.display = "flex";
}
function closeEditPopup() {
    document.getElementById("popupEdit").style.display = "none";
}

function updateUser() {
    const idx = users.findIndex(x => x.id === editingId);

    users[idx].username = document.getElementById("edit_username").value;
    users[idx].password = document.getElementById("edit_password").value;
    users[idx].name = document.getElementById("edit_name").value;
    users[idx].phone = document.getElementById("edit_phone").value;

    saveData();
    closeEditPopup();
    renderTable(currentPage);
}

/* ================================================
   DELETE USER
================================================ */
function deleteUser(id) {
    if (!confirm("Xóa người dùng?")) return;

    users = users.filter(x => x.id !== id);
    saveData();
    renderTable(currentPage);
}

/* ================================================
   SEARCH
================================================ */
function applySearch() {
    const text = document.getElementById("searchInput").value.toLowerCase();

    const origin = JSON.parse(localStorage.getItem("users") || "[]");

    users = origin.filter(u =>
        u.username.toLowerCase().includes(text) ||
        u.name.toLowerCase().includes(text)
    );

    currentPage = 1;
    renderTable(1);
}

/* ================================================
   INIT
================================================ */
document.addEventListener("DOMContentLoaded", async () => {
    users = await loadUsers();
    renderTable();
});

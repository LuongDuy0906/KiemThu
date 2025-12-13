/* =========================================
   SWITCH TABS
========================================= */
function switchTab(type) {
    document.getElementById("loginForm").classList.toggle("hidden", type !== "login");
    document.getElementById("registerForm").classList.toggle("hidden", type !== "register");

    document.getElementById("tab-login").classList.toggle("active", type === "login");
    document.getElementById("tab-register").classList.toggle("active", type === "register");
}

/* =========================================
   LOAD USERS (FIX CỐT LÕI)
========================================= */
async function loadUsers() {
    let stored = localStorage.getItem("users");
    if (stored) return JSON.parse(stored);

    const res = await fetch("data/users.json");
    const users = await res.json();

    localStorage.setItem("users", JSON.stringify(users));
    return users;
}

/* =========================================
   LOGIN
========================================= */
async function login() {
    let user = login_user.value.trim();
    let pass = login_pass.value.trim();

    if (!user || !pass) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    const users = await loadUsers();

    const u = users.find(x => x.username === user && x.password === pass);

    if (!u) {
        alert("Sai thông tin đăng nhập!");
        return;
    }

    alert("Đăng nhập thành công!");

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("loggedUser", u.username);

    // luôn thoát iframe + tránh cache
    window.top.location.href = "admin.html?ts=" + Date.now();
}

/* =========================================
   REGISTER
========================================= */
function register() {
    let user = reg_user.value.trim();
    let email = reg_email.value.trim();
    let pass = reg_pass.value.trim();
    let pass2 = reg_pass2.value.trim();

    if (!user || !email || !pass || !pass2) {
        alert("Vui lòng nhập đầy đủ!");
        return;
    }

    if (pass !== pass2) {
        alert("Mật khẩu nhập lại không trùng!");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users") || "[]");

    if (users.some(x => x.username === user)) {
        alert("Tên đăng nhập đã tồn tại!");
        return;
    }

    users.push({
        id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
        username: user,
        email,
        password: pass
    });

    localStorage.setItem("users", JSON.stringify(users));

    alert("Đăng ký thành công!");
    switchTab('login');
}

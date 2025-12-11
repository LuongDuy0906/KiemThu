/* =========================================
       SIDEBAR LOAD PAGE
    ========================================= */
    function loadPage(page, element) {
        document.getElementById("contentFrame").src = page;
        document.querySelectorAll(".menu-item").forEach(i => i.classList.remove("active"));
        element.classList.add("active");
    }

    /* =========================================
       USER DROPDOWN LOGIC
    ========================================= */
    let isLoggedIn = false;
    let loggedUser = "Tài khoản";

    // Không cho vào admin.html nếu chưa login
    if (localStorage.getItem("isLoggedIn") !== "true") {
        window.location.href = "auth.html";
    }


    function loadAuthState() {
        isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        loggedUser = localStorage.getItem("loggedUser") || "Tài khoản";
    }  //  Bạn có thể đổi khi có hệ thống login thật

    function toggleDropdown() {
        const menu = document.getElementById("dropdownMenu");
        menu.style.display = (menu.style.display === "flex") ? "none" : "flex";
    }

    function renderDropdown() {
        let menu = document.getElementById("dropdownMenu");
        let label = document.getElementById("headerUserLabel");

        const user = localStorage.getItem("loggedUser") || "Admin";

        // Luôn hiển thị đã đăng nhập
        label.innerText = "Xin chào, " + user;

        menu.innerHTML = `
            <div class="dropdown-item">🔔 Thông báo</div>
            <div class="dropdown-item">⚙️ Cài đặt</div>
            <div class="dropdown-item" onclick="logout()">🚪 Đăng xuất</div>
        `;
    }


    function goLogin() {
        window.location.href = "auth.html";
    }

    function logout() {
        if (!confirm("Đăng xuất?")) return;

        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("loggedUser");

        // reset biến
        isLoggedIn = false;
        loggedUser = null;

    // chuyển sang trang đăng nhập
        window.location.href = "auth.html?ts=" + Date.now();
    }


    // Khởi tạo dropdown
    document.addEventListener("DOMContentLoaded", () => {
        loadAuthState();
        renderDropdown();
    });

    // Ẩn dropdown khi bấm ra ngoài
    document.addEventListener("click", (e) => {
        const dd = document.getElementById("dropdownMenu");
        const area = document.querySelector(".user-area");

        if (!area.contains(e.target)) {
            dd.style.display = "none";
        }
    });
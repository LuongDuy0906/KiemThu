/* =========================
   LOCAL STORAGE
=========================== */
let products = [];
let users = [];
let orders = [];
let tempItems = [];
let editingOrder = null;

function saveLocal(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

async function loadLocal(key, file) {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);

    const res = await fetch(file);
    const json = await res.json();
    saveLocal(key, json);
    return json;
}

document.addEventListener("DOMContentLoaded", async () => {
    products = await loadLocal("products", "data/products.json");
    users    = await loadLocal("users",    "data/users.json");
    orders   = await loadLocal("orders",   "data/orders.json");

    renderOrders();
    renderPagination();
    loadCustomers();
});

/* =========================
   LOAD CUSTOMER SELECT
=========================== */
function loadCustomers() {
    const sel = document.getElementById("order_customer");
    sel.innerHTML = `<option value="">-- Chọn KH --</option>`;

    users.forEach(u => {
        sel.innerHTML += `<option value="${u.id}">${u.name} - ${u.phone}</option>`;
    });
}

/* =========================
   RENDER TABLE
=========================== */
function renderOrders() {
    const tbody = document.querySelector("#ordersTable tbody");
    tbody.innerHTML = "";

    orders.forEach(o => {
        tbody.innerHTML += `
            <tr>
                <td>${o.id}</td>
                <td>${o.customerName}</td>
                <td>${o.phone}</td>
                <td>${o.address}</td>
                <td>${o.createdDate}</td>
                <td>${o.paymentMethod}</td>
                <td class="right">${o.totalAmount.toLocaleString()} ₫</td>
                <td>
                    <button class="btn btn-info" onclick="viewOrder(${o.id})">Xem</button>
                    <button class="btn btn-primary" onclick="editOrder(${o.id})">Sửa</button>
                    <button class="btn btn-danger" onclick="deleteOrder(${o.id})">Xóa</button>
                </td>
            </tr>
        `;
    });
}

/* =========================
   PAGINATION
=========================== */
function renderPagination() {
    const div = document.getElementById("pagination");
    div.innerHTML = "";
    const total = Math.ceil(orders.length / 6);

    for (let i = 1; i <= total; i++) {
        div.innerHTML += `<button>${i}</button>`;
    }
}

/* =========================
   POPUP HANDLERS
=========================== */
function openAddOrder() {
    editingOrder = null;
    tempItems = [];

    orderTitle.textContent = "Tạo Hóa Đơn";
    popupOrder.style.display = "flex";
}

function closePopupOrder() { popupOrder.style.display = "none"; }
function closeProductPopup() { productPopup.style.display = "none"; }
function closePopupView() { popupView.style.display = "none"; }

function openProductPopup() {
    loadProductPicker();
    productPopup.style.display = "flex";
}

/* =========================
   PRODUCT PICKER
=========================== */
function loadProductPicker() {
    const body = document.getElementById("productPickerBody");
    body.innerHTML = "";

    products.forEach(p => {
        body.innerHTML += `
            <tr>
                <td><input type="checkbox" data-id="${p.id}"></td>
                <td>${p.name}</td>
                <td>${p.price.toLocaleString()}₫</td>
                <td><input type="number" min="1" value="1" style="width:70px" data-qty="${p.id}"></td>
            </tr>`;
    });
}

function addSelectedProducts() {
    const rows = document.querySelectorAll("#productPickerBody tr");

    rows.forEach(r => {
        const cb = r.querySelector("input[type='checkbox']");
        if (!cb.checked) return;

        const id = Number(cb.dataset.id);
        const qty = Number(r.querySelector("input[data-qty]").value);

        const p = products.find(x => x.id === id);

        tempItems.push({
            productId: p.id,
            productName: p.name,
            quantity: qty,
            price: p.price,
            total: p.price * qty
        });
    });

    renderOrderItems();
    closeProductPopup();
}

/* =========================
   RENDER ORDER ITEMS
=========================== */
function renderOrderItems() {
    const tbody = document.querySelector("#orderItemsTable tbody");
    tbody.innerHTML = "";

    tempItems.forEach((it, i) => {
        tbody.innerHTML += `
            <tr>
                <td>${it.productName}</td>
                <td class="right">${it.price.toLocaleString()}₫</td>
                <td>${it.quantity}</td>
                <td class="right">${it.total.toLocaleString()}₫</td>
                <td><button class="btn btn-danger" onclick="removeItem(${i})">X</button></td>
            </tr>
        `;
    });

    updateTotal();
}

function removeItem(i) {
    tempItems.splice(i, 1);
    renderOrderItems();
}

function updateTotal() {
    const sum = tempItems.reduce((a, b) => a + b.total, 0);
    order_total.value = sum.toLocaleString() + " ₫";
}

/* =========================
   SAVE ORDER
=========================== */
function saveOrder() {
    if (tempItems.length === 0) {
        alert("Chọn ít nhất 1 sản phẩm");
        return;
    }

    const obj = {
        id: editingOrder ? editingOrder.id : (orders.length ? Math.max(...orders.map(x => x.id)) + 1 : 1),
        customerId: Number(order_customer.value) || null,
        customerName: order_name.value,
        phone: order_phone.value,
        email: order_email.value,
        address: order_address.value,
        createdDate: order_date.value,
        paymentMethod: order_payment.value,
        items: tempItems,
        totalAmount: tempItems.reduce((s, it) => s + it.total, 0)
    };

    if (editingOrder) {
        const idx = orders.findIndex(o => o.id === editingOrder.id);
        orders[idx] = obj;
    } else {
        orders.push(obj);
    }

    saveLocal("orders", orders);
    renderOrders();
    renderPagination();
    closePopupOrder();
}

/* =========================
   VIEW ORDER
=========================== */
function viewOrder(id) {
    const o = orders.find(x => x.id === id);

    viewBody.innerHTML = `
        <p><strong>Mã HĐ:</strong> ${o.id}</p>
        <p><strong>Khách hàng:</strong> ${o.customerName}</p>
        <p><strong>Địa chỉ:</strong> ${o.address}</p>
        <p><strong>Ngày lập:</strong> ${o.createdDate}</p>
        <p><strong>Thanh toán:</strong> ${o.paymentMethod}</p>

        <h4>Sản phẩm</h4>
        <table class="table-mini">
            <thead>
                <tr><th>Sản phẩm</th><th>Giá</th><th>SL</th><th>Tổng</th></tr>
            </thead>
            <tbody>
                ${o.items.map(i => `
                    <tr>
                        <td>${i.productName}</td>
                        <td class="right">${i.price.toLocaleString()}₫</td>
                        <td>${i.quantity}</td>
                        <td class="right">${i.total.toLocaleString()}₫</td>
                    </tr>
                `).join("")}
            </tbody>
        </table>

        <p style="text-align:right;margin-top:10px;"><strong>
            Tổng cộng: ${o.totalAmount.toLocaleString()}₫
        </strong></p>
    `;

    popupView.style.display = "flex";
}

/* =========================
   EDIT ORDER
=========================== */
function editOrder(id) {
    const o = orders.find(x => x.id === id);
    editingOrder = o;

    orderTitle.textContent = "Sửa Hóa Đơn";

    order_customer.value = o.customerId;
    order_name.value = o.customerName;
    order_phone.value = o.phone;
    order_email.value = o.email;
    order_address.value = o.address;
    order_date.value = o.createdDate;
    order_payment.value = o.paymentMethod;

    tempItems = JSON.parse(JSON.stringify(o.items));
    renderOrderItems();

    popupOrder.style.display = "flex";
}

/* =========================
   DELETE ORDER
=========================== */
function deleteOrder(id) {
    if (!confirm("Bạn có chắc muốn xóa?")) return;

    orders = orders.filter(o => o.id !== id);
    saveLocal("orders", orders);

    renderOrders();
    renderPagination();
}
/* =========================
   LOCAL STORAGE
=========================== */
let coupons = [];
let editing = null;

async function loadLocal(key, file) {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);

    const res = await fetch(file);
    const json = await res.json();
    localStorage.setItem(key, JSON.stringify(json));
    return json;
}

document.addEventListener("DOMContentLoaded", async () => {
    coupons = await loadLocal("coupons", "data/discounts.json");
    renderTable();
    renderPagination();
});

/* =========================
   RENDER TABLE
=========================== */
function renderTable() {
    const tbody = document.querySelector("#couponTable tbody");
    tbody.innerHTML = "";

    coupons.forEach(c => {
        tbody.innerHTML += `
            <tr>
                <td><img src="${c.poster}" class="poster-img"></td>
                <td>${c.programName}</td>
                <td>${c.code}</td>
                <td>${c.type === "percent" ? "Giảm %" : "Giảm tiền"}</td>
                <td>${c.type === "percent" ? c.amount + "%" : c.amount.toLocaleString() + "₫"}</td>
                <td>${c.startDate}</td>
                <td>${c.endDate}</td>
                <td>${c.quantity}</td>
                <td>
                    <button class="btn btn-info" onclick="viewCoupon(${c.id})">Xem</button>
                    <button class="btn btn-primary" onclick="editCoupon(${c.id})">Sửa</button>
                    <button class="btn btn-danger" onclick="deleteCoupon(${c.id})">Xóa</button>
                </td>
            </tr>
        `;
    });
}

/* =========================
   PAGINATION (OPTIONAL)
=========================== */
function renderPagination() {
    document.getElementById("pagination").innerHTML = "";
}

/* =========================
   OPEN / CLOSE POPUP
=========================== */
function openAdd() {
    editing = null;
    popupTitle.textContent = "Thêm Mã Giảm Giá";

    c_name.value = "";
    c_type.value = "percent";
    c_code.value = "";
    c_amount.value = "";
    c_start.value = "";
    c_end.value = "";
    c_qty.value = "";
    c_poster.value = "";

    popupCoupon.style.display = "flex";
}

function closePopup() {
    popupCoupon.style.display = "none";
}

function closeView() {
    popupView.style.display = "none";
}

/* =========================
   SAVE COUPON
=========================== */
function saveCoupon() {

    let error;

    // Tên chương trình
    error = validateDiscountName(c_name.value);
    if (error) return alert(`${error.message} (Mã lỗi: ${error.code})`);

    // Loại khuyến mãi
    error = validateDiscountType(c_type.value);
    if (error) return alert(`${error.message} (Mã lỗi: ${error.code})`);

    // Mã khuyến mãi
    error = validateDiscountCode(
        c_code.value,
        c_type.value,
        coupons,
        !!editing,
        editing?.id
    );
    if (error) return alert(`${error.message} (Mã lỗi: ${error.code})`);

    error = validateDiscountAmount(
        c_amount.value,
        c_type.options[c_type.selectedIndex].text
    );
    if (error) return alert(`${error.message} (Mã lỗi: ${error.code})`);

    // Ngày bắt đầu
    error = validateStartDate(c_start.value);
    if (error) return alert(`${error.message} (Mã lỗi: ${error.code})`);

    // Ngày kết thúc
    error = validateEndDate(c_end.value, c_start.value);
    if (error) return alert(`${error.message} (Mã lỗi: ${error.code})`);

    error = validateQuantity(c_qty.value);
    if (error) return alert(`${error.message} (Mã lỗi: ${error.code})`);

    // 6️⃣ Mô tả
    error = validateDescription(c_description.value);
    if (error) return alert(`${error.message} (Mã lỗi: ${error.code})`);

    // 8️⃣ Poster (FILE)
    error = validateDiscountPoster(document.getElementById("c_poster"));
    if (error) return alert(`${error.message} (Mã lỗi: ${error.code})`);

    /* ===== SAVE ===== */
    const obj = {
        id: editing
            ? editing.id
            : (coupons.length ? Math.max(...coupons.map(a => a.id)) + 1 : 1),

        programName: c_name.value.trim(),
        type: c_type.value,
        code: c_code.value.trim(),
        amount: Number(c_amount.value),
        startDate: c_start.value,
        endDate: c_end.value,
        quantity: Number(c_qty.value),
        poster: c_poster.value || "assets/images/default.jpg"
    };

    if (editing) {
        const index = coupons.findIndex(x => x.id === editing.id);
        coupons[index] = obj;
    } else {
        coupons.push(obj);
    }

    localStorage.setItem("coupons", JSON.stringify(coupons));
    renderTable();
    closePopup();
}


/* =========================
   VIEW DETAILS
=========================== */
function viewCoupon(id) {
    const c = coupons.find(x => x.id === id);

    viewBody.innerHTML = `
        <p><strong>Tên chương trình:</strong> ${c.programName}</p>
        <p><strong>Mã:</strong> ${c.code}</p>
        <p><strong>Loại:</strong> ${c.type === "percent" ? "Giảm %" : "Giảm tiền"}</p>
        <p><strong>Lượng giảm:</strong> ${c.type === "percent" ? c.amount + "%" : c.amount.toLocaleString() + "₫"}</p>
        <p><strong>Ngày bắt đầu:</strong> ${c.startDate}</p>
        <p><strong>Ngày kết thúc:</strong> ${c.endDate}</p>
        <p><strong>Số lượng:</strong> ${c.quantity}</p>

        <img src="${c.poster}" class="poster-img" style="width:150px;height:150px;margin-top:12px;">
    `;

    popupView.style.display = "flex";
}

/* =========================
   EDIT
=========================== */
function editCoupon(id) {
    editing = coupons.find(x => x.id === id);

    popupTitle.textContent = "Sửa Mã Giảm Giá";

    c_name.value = editing.programName;
    c_type.value = editing.type;
    c_code.value = editing.code;
    c_amount.value = editing.amount;
    c_start.value = editing.startDate;
    c_end.value = editing.endDate;
    c_qty.value = editing.quantity;
    c_poster.value = editing.poster;

    popupCoupon.style.display = "flex";
}

/* =========================
   DELETE
=========================== */
function deleteCoupon(id) {
    if (!confirm("Bạn có chắc muốn xóa?")) return;

    coupons = coupons.filter(c => c.id !== id);
    localStorage.setItem("coupons", JSON.stringify(coupons));
    renderTable();
}
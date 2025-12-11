 let data = [];
    let itemsPerPage = 8;
    let currentPage = 1;
    let editProductId = null;

    async function loadData(key, file) {
        let local = localStorage.getItem(key);
        if (local) return JSON.parse(local);

        let json = await fetch(file).then(r => r.json());
        localStorage.setItem(key, JSON.stringify(json));
        return json;
    }

    function saveData(key, arr) { localStorage.setItem(key, JSON.stringify(arr)); }
    function generateId(list) { return list.length ? Math.max(...list.map(x => x.id)) + 1 : 1; }

    document.addEventListener("DOMContentLoaded", async () => {
        data = await loadData("products", "data/products.json");
        renderTable(data, currentPage);
        renderPagination(data);
    });

    function renderTable(list, page) {
        const tbody = document.querySelector("tbody");
        tbody.innerHTML = "";
        const start = (page - 1) * itemsPerPage;

        list.slice(start, start + itemsPerPage).forEach(p => {
            let tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${p.id}</td>
                <td>${p.name}</td>
                <td>${p.manufactureDate}</td>
                <td>${p.category}</td>
                <td>${p.origin}</td>
                <td>${p.price.toLocaleString()} VNĐ</td>
                <td>${p.description}</td>
                <td>${p.supplierId}</td>

                <td class="actions">
                    <button class="btn btn-info" onclick="openPopupEdit(${p.id})">Sửa</button>
                    <button class="btn btn-danger" onclick="deleteProduct(${p.id})">Xóa</button>
                </td>
            `;

            tbody.appendChild(tr);
        });
    }

    function renderPagination(list) {
        const total = Math.ceil(list.length / itemsPerPage);
        const div = document.querySelector(".pagination");
        div.innerHTML = "";

        for (let i = 1; i <= total; i++) {
            let btn = document.createElement("button");
            btn.textContent = i;
            btn.onclick = () => {
                currentPage = i;
                renderTable(data, currentPage);
            };
            div.appendChild(btn);
        }
    }

    function openPopupAdd() { document.getElementById("popupAdd").style.display = "flex"; }
    function closePopupAdd() { document.getElementById("popupAdd").style.display = "none"; }

    function addSubmit(e) {
        e.preventDefault();

        const newItem = {
            id: generateId(data),
            name: add_name.value,
            manufactureDate: add_manufactureDate.value,
            category: add_category.value,
            origin: add_origin.value,
            price: parseFloat(add_price.value),
            description: add_description.value,
            supplierId: parseInt(add_supplier_id.value)
        };

        data.push(newItem);
        saveData("products", data);

        renderTable(data, currentPage);
        closePopupAdd();
        alert("Thêm sản phẩm thành công!");
    }

    function openPopupEdit(id) {
        const p = data.find(x => x.id === id);
        editProductId = id;

        edit_name.value = p.name;
        edit_manufactureDate.value = p.manufactureDate;
        edit_category.value = p.category;
        edit_origin.value = p.origin;
        edit_price.value = p.price;
        edit_description.value = p.description;
        edit_supplier_id.value = p.supplierId;

        document.getElementById("popupEdit").style.display = "flex";
    }

    function closePopupEdit() {
        document.getElementById("popupEdit").style.display = "none";
    }

    function editSubmit(e) {
        e.preventDefault();

        let idx = data.findIndex(x => x.id === editProductId);

        data[idx].name = edit_name.value;
        data[idx].manufactureDate = edit_manufactureDate.value;
        data[idx].category = edit_category.value;
        data[idx].origin = edit_origin.value;
        data[idx].price = parseFloat(edit_price.value);
        data[idx].description = edit_description.value;
        data[idx].supplierId = parseInt(edit_supplier_id.value);

        saveData("products", data);
        renderTable(data, currentPage);
        closePopupEdit();
        alert("Cập nhật sản phẩm thành công!");
    }

    function deleteProduct(id) {
        if (!confirm("Bạn có chắc muốn xóa sản phẩm?")) return;

        data = data.filter(p => p.id !== id);
        saveData("products", data);

        renderTable(data, currentPage);
        alert("Xóa thành công!");
    }
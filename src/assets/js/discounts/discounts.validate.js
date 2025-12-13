function validateDiscountName(name) {
    const value = name.trim();

    if (!value) {
        return { code: "6E1", message: "Tên chương trình không được để trống" };
    }

    const specialCharRegex = /[^a-zA-Z0-9À-ỹ\s]/u;
    if (specialCharRegex.test(value)) {
        return { code: "6E2", message: "Tên chương trình không được chứa kí tự đặc biệt" };
    }

    if (value.length > 40) {
        return { code: "6E3", message: "Tên chương trình không được vượt quá 40 ký tự" };
    }

    return null;
}

function validateDiscountType(type) {

    if (!type || type.trim() === "") {
        return {
            code: "6E4",
            message: "Loại khuyến mãi không được để trống"
        };
    }

    const validTypes = [
        "Khuyến mãi cửa hàng",
        "Khuyến mãi dịp lễ",
        "Khuyến mãi số lượng",
        "Khuyến mãi tổng tiền"
    ];

    if (!validTypes.includes(type)) {
        return {
            code: "6E4",
            message: "Loại khuyến mãi không hợp lệ"
        };
    }

    return null;
}

function validateDiscountCode(code, type, coupons, isEdit = false, currentId = null) {

    // 6E5 - để trống
    if (!code || !code.trim()) {
        return {
            code: "6E5",
            message: "Mã giảm giá không được để trống"
        };
    }

    code = code.trim();

    // 6E8 - ký tự đặc biệt & dấu cách
    if (!/^[A-Z0-9]+$/.test(code)) {
        return {
            code: "6E8",
            message: "Mã giảm giá không được chứa ký tự đặc biệt và dấu cách"
        };
    }

    // 6E6 - độ dài
    if (code.length !== 10) {
        return {
            code: "6E6",
            message: "Mã giảm giá phải có 10 ký tự"
        };
    }

    // Map loại khuyến mãi -> prefix
    const typePrefix = {
        "Khuyến mãi cửa hàng": "CH",   // Khuyến mãi cửa hàng
        "Khuyến mãi dịp lễ": "DL", // Khuyến mãi dịp lễ
        "Khuyến mãi số lượng": "SL",// Khuyến mãi số lượng
        "Khuyến mãi tổng tiền": "TG"    // Khuyến mãi tổng tiền
    };

    const prefix = typePrefix[type];

    // 6E9 - sai quy cách
    if (!prefix || !code.startsWith(prefix)) {
        return {
            code: "6E9",
            message: "Mã giảm giá không hợp lệ vì sai quy cách"
        };
    }

    // CH + ddMMyy + xx
    const regex = new RegExp(`^${prefix}\\d{6}\\d{2}$`);
    if (!regex.test(code)) {
        return {
            code: "6E9",
            message: "Mã giảm giá không hợp lệ vì sai quy cách"
        };
    }

    // 6E7 - trùng mã
    const isDuplicate = coupons.some(c =>
        c.code === code && (!isEdit || c.id !== currentId)
    );

    if (isDuplicate) {
        return {
            code: "6E7",
            message: "Mã giảm giá đã tồn tại"
        };
    }

    return null; // hợp lệ
}

function validateStartDate(value) {
    if (!value || value.trim() === "") {
        return {
            code: "6E10",
            message: "Không được để trống ngày bắt đầu"
        };
    }

    return null;
}

function validateEndDate(endDate, startDate) {

    // 6E11 - trống
    if (!endDate || endDate.trim() === "") {
        return {
            code: "6E11",
            message: "Không được để trống ngày kết thúc"
        };
    }

    // nếu chưa có ngày bắt đầu thì không so sánh
    if (!startDate || startDate.trim() === "") {
        return null;
    }

    // parse dd/MM/yyyy → Date
    const parseDate = (d) => {
        const [day, month, year] = d.split("/");
        return new Date(year, month - 1, day);
    };

    const start = parseDate(startDate);
    const end = parseDate(endDate);

    // 6E12 - ngày kết thúc <= ngày bắt đầu
    if (end <= start) {
        return {
            code: "6E12",
            message: "Ngày kết thúc phải lớn hơn ngày bắt đầu"
        };
    }

    return null;
}

function validateDescription(description) {

    if (!description) return null; // không bắt buộc

    if (description.length > 200) {
        return {
            code: "6E13",
            message: "Hãy nhập mô tả ngắn hơn hoặc bằng 200 ký tự"
        };
    }

    return null;
}

function validateDiscountAmount(amount, discountType) {

    const requiredTypes = [
        "Khuyến mãi cửa hàng",
        "Khuyến mãi dịp lễ"
    ];

    // ===== BẮT BUỘC NHẬP =====
    if (requiredTypes.includes(discountType)) {
        if (amount === "" || amount === null || amount === undefined) {
            return {
                code: "6E14",
                message: "Không được để trống lượng giảm"
            };
        }
    } else {
        // Không bắt buộc nhập → nếu trống thì bỏ qua
        if (amount === "" || amount === null || amount === undefined) {
            return null;
        }
    }

    const amountStr = String(amount);

    // ===== KHÔNG CHỨA CHỮ / KÝ TỰ ĐẶC BIỆT / DẤU CÁCH =====
    if (!/^\d+(\.\d+)?$/.test(amountStr)) {
        return {
            code: "6E16",
            message: "Không được nhập ký tự chữ, ký tự đặc biệt hoặc dấu cách"
        };
    }

    const value = Number(amount);

    // ===== GIÁ TRỊ HỢP LỆ =====
    if (value <= 0 || value > 100) {
        return {
            code: "6E15",
            message: "Lượng giảm phải trong khoảng từ 1 đến 100"
        };
    }

    return null;
}

function validateDiscountPoster(fileInput) {

    if (!fileInput || !fileInput.files) {
        return {
            code: "6E17",
            message: "Không được để trống ảnh khuyến mãi"
        };
    }

    const files = fileInput.files;

    // ===== KHÔNG CHỌN FILE =====
    if (files.length === 0) {
        return {
            code: "6E17",
            message: "Không được để trống ảnh khuyến mãi"
        };
    }

    // ===== CHỌN > 1 FILE =====
    if (files.length > 1) {
        return {
            code: "6E20",
            message: "Chỉ được chọn 1 file"
        };
    }

    const file = files[0];
    const maxSize = 25 * 1024 * 1024; // 25MB
    const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/svg+xml"
    ];

    // ===== ĐỊNH DẠNG =====
    if (!allowedTypes.includes(file.type)) {
        return {
            code: "6E18",
            message: "Bạn đã chọn file không đúng định dạng"
        };
    }

    // ===== KÍCH THƯỚC =====
    if (file.size > maxSize) {
        return {
            code: "6E19",
            message: "File quá lớn không thể lựa chọn"
        };
    }

    return null;
}

function validateQuantity(value) {

    // 6E21 – Không được để trống
    if (value === null || value === undefined || value.toString().trim() === "") {
        return {
            code: "6E21",
            message: "Không được để trống số lượng"
        };
    }

    // 6E23 – Chứa chữ, ký tự đặc biệt, dấu cách
    // Chỉ cho phép số nguyên dương
    if (!/^\d+$/.test(value)) {
        return {
            code: "6E23",
            message: "Không được nhập ký tự chữ, ký tự đặc biệt hoặc dấu cách"
        };
    }

    const qty = Number(value);

    // 6E22 – Phải lớn hơn 0
    if (qty <= 0) {
        return {
            code: "6E22",
            message: "Số lượng phải lớn hơn 0"
        };
    }

    return null; // ✅ Hợp lệ
}

module.exports = {
    validateDiscountName,
    validateDiscountType,
    validateDiscountCode,
    validateDiscountAmount,
    validateStartDate,
    validateEndDate,
    validateQuantity,
    validateDescription,
    validateDiscountPoster
}



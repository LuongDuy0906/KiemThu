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

    if (!code || !code.trim()) {
        return {
            code: "6E5",
            message: "Mã giảm giá không được để trống"
        };
    }

    code = code.trim();

    if (!/^[A-Z0-9]+$/.test(code)) {
        return {
            code: "6E8",
            message: "Mã giảm giá không được chứa ký tự đặc biệt và dấu cách"
        };
    }

    if (code.length !== 10) {
        return {
            code: "6E6",
            message: "Mã giảm giá phải có 10 ký tự"
        };
    }

    const typePrefix = {
        "Khuyến mãi cửa hàng": "CH",   
        "Khuyến mãi dịp lễ": "DL", 
        "Khuyến mãi số lượng": "SL",
        "Khuyến mãi tổng tiền": "TG" 
    };

    const prefix = typePrefix[type];

    if (!prefix || !code.startsWith(prefix)) {
        return {
            code: "6E9",
            message: "Mã giảm giá không hợp lệ vì sai quy cách"
        };
    }

    const regex = new RegExp(`^${prefix}\\d{6}\\d{2}$`);
    if (!regex.test(code)) {
        return {
            code: "6E9",
            message: "Mã giảm giá không hợp lệ vì sai quy cách"
        };
    }

    const isDuplicate = coupons.some(c =>
        c.code === code && (!isEdit || c.id !== currentId)
    );

    if (isDuplicate) {
        return {
            code: "6E7",
            message: "Mã giảm giá đã tồn tại"
        };
    }

    return null;
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

    if (!endDate || endDate.trim() === "") {
        return {
            code: "6E11",
            message: "Không được để trống ngày kết thúc"
        };
    }

    if (!startDate || startDate.trim() === "") {
        return null;
    }

    const parseDate = (d) => {
        const [day, month, year] = d.split("/");
        return new Date(year, month - 1, day);
    };

    const start = parseDate(startDate);
    const end = parseDate(endDate);

    if (end <= start) {
        return {
            code: "6E12",
            message: "Ngày kết thúc phải lớn hơn ngày bắt đầu"
        };
    }

    return null;
}

function validateDescription(description) {

    if (!description) return null;

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

    if (requiredTypes.includes(discountType)) {
        if (amount === "" || amount === null || amount === undefined) {
            return {
                code: "6E14",
                message: "Không được để trống lượng giảm"
            };
        }
    } else {
        if (amount === "" || amount === null || amount === undefined) {
            return null;
        }
    }

    const amountStr = String(amount);

    if (!/^\d+(\.\d+)?$/.test(amountStr)) {
        return {
            code: "6E16",
            message: "Không được nhập ký tự chữ, ký tự đặc biệt hoặc dấu cách"
        };
    }

    const value = Number(amount);

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

    if (files.length === 0) {
        return {
            code: "6E17",
            message: "Không được để trống ảnh khuyến mãi"
        };
    }

    if (files.length > 1) {
        return {
            code: "6E20",
            message: "Chỉ được chọn 1 file"
        };
    }

    const file = files[0];
    const maxSize = 25 * 1024 * 1024;
    const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/svg+xml"
    ];

    if (!allowedTypes.includes(file.type)) {
        return {
            code: "6E18",
            message: "Bạn đã chọn file không đúng định dạng"
        };
    }

    if (file.size > maxSize) {
        return {
            code: "6E19",
            message: "File quá lớn không thể lựa chọn"
        };
    }

    return null;
}

function validateQuantity(value) {

    if (value === null || value === undefined || value.toString().trim() === "") {
        return {
            code: "6E21",
            message: "Không được để trống số lượng"
        };
    }

    if (!/^\d+$/.test(value)) {
        return {
            code: "6E23",
            message: "Không được nhập ký tự chữ, ký tự đặc biệt hoặc dấu cách"
        };
    }

    const qty = Number(value);

    if (qty <= 0) {
        return {
            code: "6E22",
            message: "Số lượng phải lớn hơn 0"
        };
    }

    return null;
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



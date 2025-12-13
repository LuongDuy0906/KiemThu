const {
    validateDiscountName,
    validateDiscountType,
    validateDiscountCode,
    validateStartDate,
    validateEndDate,
    validateDescription,
    validateDiscountAmount,
    validateQuantity
} = require('../src/assets/js/discounts/discounts.validate');

const { validCoupon, couponList } = require(
    "./__mocks__/coupon.mock"
);

describe("DISCOUNT VALIDATION TESTS", () => {

    /* =========================
       TÊN CHƯƠNG TRÌNH
    ========================= */
    describe("validateDiscountName", () => {

        test("6E1 - tên trống", () => {
            const err = validateDiscountName("");
            expect(err.code).toBe("6E1");
        });

        test("6E2 - chứa ký tự đặc biệt", () => {
            const err = validateDiscountName("Sale@@@");
            expect(err.code).toBe("6E2");
        });

        test("6E3 - vượt quá 40 ký tự", () => {
            const err = validateDiscountName("A".repeat(41));
            expect(err.code).toBe("6E3");
        });

        test("Tên hợp lệ", () => {
            const err = validateDiscountName(validCoupon.programName);
            expect(err).toBeNull();
        });
    });

    /* =========================
       LOẠI KHUYẾN MÃI
    ========================= */
    describe("validateDiscountType", () => {

        test("6E4 - loại trống", () => {
            const err = validateDiscountType("");
            expect(err.code).toBe("6E4");
        });

        test("Loại hợp lệ", () => {
            const err = validateDiscountType(validCoupon.type);
            expect(err).toBeNull();
        });
    });

    /* =========================
       MÃ KHUYẾN MÃI
    ========================= */
    describe("validateDiscountCode", () => {

        test("6E5 - mã trống", () => {
            const err = validateDiscountCode("", validCoupon.type, couponList);
            expect(err.code).toBe("6E5");
        });

        test("6E6 - mã dài hơn 10 ký tự", () => {
            const err = validateDiscountCode("CH010125300", validCoupon.type, couponList);
            expect(err.code).toBe("6E6");
        });

        test("6E8 - chứa ký tự đặc biệt / dấu cách", () => {
            const err = validateDiscountCode("CH01 01253", validCoupon.type, couponList);
            expect(err.code).toBe("6E8");
        });

        test("6E7 - mã đã tồn tại", () => {
            const err = validateDiscountCode(
                validCoupon.code,
                validCoupon.type,
                couponList
            );
            expect(err.code).toBe("6E7");
        });

        test("Edit - cho phép giữ nguyên mã", () => {
            const err = validateDiscountCode(
                validCoupon.code,
                validCoupon.type,
                couponList,
                true,
                validCoupon.id
            );
            expect(err).toBeNull();
        });

        test("Mã hợp lệ", () => {
            const err = validateDiscountCode(
                "CH02022530",
                validCoupon.type,
                couponList
            );
            expect(err).toBeNull();
        });
    });

    /* =========================
       NGÀY BẮT ĐẦU
    ========================= */
    describe("validateStartDate", () => {

        test("6E10 - ngày bắt đầu trống", () => {
            const err = validateStartDate("");
            expect(err.code).toBe("6E10");
        });

        test("Ngày bắt đầu hợp lệ", () => {
            const err = validateStartDate(validCoupon.startDate);
            expect(err).toBeNull();
        });
    });

    /* =========================
       NGÀY KẾT THÚC
    ========================= */
    describe("validateEndDate", () => {

        test("6E11 - ngày kết thúc trống", () => {
            const err = validateEndDate("", validCoupon.startDate);
            expect(err.code).toBe("6E11");
        });

        test("6E12 - ngày kết thúc <= ngày bắt đầu", () => {
            const err = validateEndDate(
                "01/01/2025",
                "01/01/2025"
            );
            expect(err.code).toBe("6E12");
        });

        test("Ngày kết thúc hợp lệ", () => {
            const err = validateEndDate(
                validCoupon.endDate,
                validCoupon.startDate
            );
            expect(err).toBeNull();
        });
    });

    /* =========================
       MÔ TẢ
    ========================= */
    describe("validateDescription", () => {

        test("6E13 - mô tả quá 200 ký tự", () => {
            const err = validateDescription("A".repeat(201));
            expect(err.code).toBe("6E13");
        });

        test("Mô tả hợp lệ", () => {
            const err = validateDescription(validCoupon.description);
            expect(err).toBeNull();
        });
    });

    /* =========================
       LƯỢNG GIẢM
    ========================= */
    describe("validateDiscountAmount", () => {

        test("6E15 - lượng giảm <= 0", () => {
            const err = validateDiscountAmount(0, validCoupon.type);
            expect(err.code).toBe("6E15");
        });

        test("6E15 - lượng giảm > 100", () => {
            const err = validateDiscountAmount(150, validCoupon.type);
            expect(err.code).toBe("6E15");
        });

        test("6E16 - chứa ký tự chữ", () => {
            const err = validateDiscountAmount("abc", validCoupon.type);
            expect(err.code).toBe("6E16");
        });

        test("Lượng giảm hợp lệ", () => {
            const err = validateDiscountAmount(validCoupon.amount, validCoupon.type);
            expect(err).toBeNull();
        });
    });

    /* =========================
       SỐ LƯỢNG
    ========================= */
    describe("validateQuantity", () => {

        test("6E21 - số lượng trống", () => {
            const err = validateQuantity("");
            expect(err.code).toBe("6E21");
        });

        test("6E22 - số lượng <= 0", () => {
            const err = validateQuantity(0);
            expect(err.code).toBe("6E22");
        });

        test("6E23 - số lượng chứa chữ", () => {
            const err = validateQuantity("abc");
            expect(err.code).toBe("6E23");
        });

        test("Số lượng hợp lệ", () => {
            const err = validateQuantity(validCoupon.quantity);
            expect(err).toBeNull();
        });
    });
});
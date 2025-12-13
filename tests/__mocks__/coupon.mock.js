const validCoupon = {
    id: 1,
    programName: "Khuyến mãi mùa hè",
    type: "Khuyến mãi cửa hàng",
    code: "CH01012530",
    startDate: "01/01/2025",
    endDate: "10/01/2025",
    description: "Giảm giá mùa hè",
    amount: 30,
    quantity: 100,
    poster: "sale.jpg"
};

const couponList = [
    validCoupon,
    {
        id: 2,
        programName: "Khuyến mãi lễ",
        type: "Khuyến mãi dịp lễ",
        code: "DL05052520",
        startDate: "05/05/2025",
        endDate: "15/05/2025",
        amount: 20,
        quantity: 50,
        poster: "holiday.png"
    }
];

module.exports = {
    validCoupon,
    couponList
};

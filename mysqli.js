// ==================================================
//  NGUYỄN NGỌC VĂN — Chủ Hệ Thống
// ==================================================
const mysql = require('mysql2');

const con = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "nro"
});

con.connect(err => {
    if(err) return console.error('❌ Lỗi CSDL:', err.message);
    console.log('✅ Kết nối CSDL thành công — NGUYỄN NGỌC VĂN');
});

module.exports = con;

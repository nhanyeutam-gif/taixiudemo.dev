// ==================================================
//  NGUYỄN NGỌC VĂN — Chủ Hệ Thống Game Tài Xỉu
//  Đầy đủ: Đăng ký · Đăng nhập · Nạp tiền · Rút tiền · Chơi game · Quản trị
// ==================================================

const express     = require('express');
const app         = express();
const http        = require('http').Server(app);
const mysqli      = require('./mysqli');
const checkstring = require('./string');
const sodu        = require('./sodu');
const info        = require('./info');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========== TRANG CHỦ ==========
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NGUYỄN NGỌC VĂN — Tài Xỉu</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"/>
    <style>
        *{font-family:Segoe UI,sans-serif}
        body{background:linear-gradient(135deg,#0f172a,#1e293b);min-height:100vh}
        .card{background:rgba(255,255,255,0.05);backdrop-filter:blur(10px);border:1px solid rgba(255,215,0,0.2)}
        .btn{transition:0.3s;cursor:pointer}
        .btn:hover{transform:scale(1.03)}
        .btn-gold{background:linear-gradient(90deg,#ffd700,#ffed4e);color:#000;font-weight:bold}
        .btn-green{background:linear-gradient(90deg,#10b981,#34d399);color:#fff}
        .btn-red{background:linear-gradient(90deg,#ef4444,#f87171);color:#fff}
        .btn-blue{background:linear-gradient(90deg,#3b82f6,#60a5fa);color:#fff}
        .box-tai{background:linear-gradient(135deg,#10b981,#059669)}
        .box-xiu{background:linear-gradient(135deg,#ef4444,#dc2626)}
        .tab.active{border-bottom:3px solid #ffd700;color:#ffd700}
        input,button{outline:none}
    </style>
</head>
<body class="text-white">
    <div class="max-w-md mx-auto p-4">
        <!-- Header -->
        <div class="text-center py-4">
            <h1 class="text-2xl font-bold text-yellow-400">👑 NGUYỄN NGỌC VĂN</h1>
            <p class="text-gray-400 text-sm">Hệ Thống Tài Xỉu Uy Tín</p>
        </div>

        <!-- Thông tin người dùng -->
        <div id="user-area" class="card rounded-xl p-4 mb-4 text-center">
            <p class="text-gray-400">Vui lòng đăng nhập</p>
            <button onclick="showTab('login')" class="btn btn-gold px-6 py-2 rounded-lg mt-2">Đăng Nhập</button>
        </div>

        <!-- Tab điều hướng -->
        <div class="flex justify-around border-b border-gray-700 mb-4" id="tabs">
            <div class="tab py-3 px-4 active" onclick="showTab('game')">🎮 Chơi Game</div>
            <div class="tab py-3 px-4 text-gray-400" onclick="showTab('nap')">💰 Nạp Tiền</div>
            <div class="tab py-3 px-4 text-gray-400" onclick="showTab('rut')">💵 Rút Tiền</div>
        </div>

        <!-- ========== TAB GAME ========== -->
        <div id="tab-game" class="tab-content">
            <div class="card rounded-xl p-5 mb-4 text-center">
                <p class="text-gray-400 mb-2">Phiên #<span id="phien-id">--</span></p>
                <p class="text-3xl font-bold text-yellow-400 mb-3" id="dem-giay">--</p>
                
                <div class="grid grid-cols-2 gap-4 mb-5">
                    <button id="btn-tai" class="btn box-tai rounded-xl p-4" onclick="datCuoc('tai')">
                        <p class="text-lg font-bold">TÀI</p>
                        <p class="text-sm opacity-80" id="cuoc-tai">0 người</p>
                    </button>
                    <button id="btn-xiu" class="btn box-xiu rounded-xl p-4" onclick="datCuoc('xiu')">
                        <p class="text-lg font-bold">XỈU</p>
                        <p class="text-sm opacity-80" id="cuoc-xiu">0 người</p>
                    </button>
                </div>

                <div class="flex gap-2 mb-3">
                    <input type="number" id="tien-cuoc" placeholder="Số tiền cược" 
                        class="flex-1 bg-gray-800 rounded-lg px-4 py-3 text-center" value="1000">
                </div>
                <button onclick="datCuoc()" class="btn btn-gold w-full py-3 rounded-lg font-bold">ĐẶT CƯỢC</button>
            </div>

            <div class="card rounded-xl p-4">
                <h3 class="font-bold mb-3">📋 Lịch sử kết quả</h3>
                <div id="lichsu-kq" class="space-y-2 text-sm">
                    <p class="text-gray-500">Chưa có dữ liệu</p>
                </div>
            </div>
        </div>

        <!-- ========== TAB NẠP TIỀN ========== -->
        <div id="tab-nap" class="tab-content hidden">
            <div class="card rounded-xl p-5">
                <h3 class="font-bold text-xl mb-4 text-center">💰 Nạp Tiền</h3>
                <p class="text-gray-400 text-sm mb-4 text-center">Quét mã hoặc chuyển khoản theo thông tin</p>
                
                <div class="bg-gray-800 rounded-lg p-4 mb-4 text-center">
                    <p class="text-sm text-gray-400">Ngân hàng</p>
                    <p class="font-bold">VCB — NGUYỄN NGỌC VĂN</p>
                    <p class="text-yellow-400 font-bold">1234567890</p>
                </div>

                <div class="space-y-3 mb-4">
                    <input type="number" id="nap-so-tien" placeholder="Số tiền nạp" 
                        class="w-full bg-gray-800 rounded-lg px-4 py-3">
                    <input type="text" id="nap-ma-giao-dich" placeholder="Mã giao dịch" 
                        class="w-full bg-gray-800 rounded-lg px-4 py-3">
                </div>
                <button onclick="napTien()" class="btn btn-green w-full py-3 rounded-lg font-bold">XÁC NHẬN NẠP</button>
            </div>
        </div>

        <!-- ========== TAB RÚT TIỀN ========== -->
        <div id="tab-rut" class="tab-content hidden">
            <div class="card rounded-xl p-5">
                <h3 class="font-bold text-xl mb-4 text-center">💵 Rút Tiền</h3>
                
                <div class="space-y-3 mb-4">
                    <input type="number" id="rut-so-tien" placeholder="Số tiền rút" 
                        class="w-full bg-gray-800 rounded-lg px-4 py-3">
                    <input type="text" id="rut-ngan-hang" placeholder="Tên ngân hàng" 
                        class="w-full bg-gray-800 rounded-lg px-4 py-3">
                    <input type="text" id="rut-so-tai-khoan" placeholder="Số tài khoản" 
                        class="w-full bg-gray-800 rounded-lg px-4 py-3">
                    <input type="text" id="rut-chu-tai-khoan" placeholder="Tên chủ tài khoản" 
                        class="w-full bg-gray-800 rounded-lg px-4 py-3">
                </div>
                <button onclick="rutTien()" class="btn btn-blue w-full py-3 rounded-lg font-bold">XÁC NHẬN RÚT</button>
            </div>
        </div>

        <!-- ========== ĐĂNG NHẬP ========== -->
        <div id="form-login" class="hidden">
            <div class="card rounded-xl p-5">
                <h3 class="font-bold text-xl mb-4 text-center">Đăng Nhập</h3>
                <div class="space-y-3 mb-4">
                    <input type="text" id="login-user" placeholder="Tên tài khoản" 
                        class="w-full bg-gray-800 rounded-lg px-4 py-3">
                    <input type="password" id="login-pass" placeholder="Mật khẩu" 
                        class="w-full bg-gray-800 rounded-lg px-4 py-3">
                </div>
                <button onclick="dangNhap()" class="btn btn-gold w-full py-3 rounded-lg font-bold mb-3">ĐĂNG NHẬP</button>
                <p class="text-center text-sm text-gray-400">Chưa có tài khoản? 
                    <a href="#" onclick="showTab('register')" class="text-yellow-400">Đăng ký</a>
                </p>
            </div>
        </div>

        <!-- ========== ĐĂNG KÝ ========== -->
        <div id="form-register" class="hidden">
            <div class="card rounded-xl p-5">
                <h3 class="font-bold text-xl mb-4 text-center">Đăng Ký</h3>
                <div class="space-y-3 mb-4">
                    <input type="text" id="reg-user" placeholder="Tên tài khoản" 
                        class="w-full bg-gray-800 rounded-lg px-4 py-3">
                    <input type="password" id="reg-pass" placeholder="Mật khẩu" 
                        class="w-full bg-gray-800 rounded-lg px-4 py-3">
                    <input type="text" id="reg-ten" placeholder="Tên hiển thị" 
                        class="w-full bg-gray-800 rounded-lg px-4 py-3">
                </div>
                <button onclick="dangKy()" class="btn btn-green w-full py-3 rounded-lg font-bold mb-3">ĐĂNG KÝ</button>
                <p class="text-center text-sm text-gray-400">Đã có tài khoản? 
                    <a href="#" onclick="showTab('login')" class="text-yellow-400">Đăng nhập</a>
                </p>
            </div>
        </div>

        <!-- Thông báo -->
        <div id="thong-bao" class="fixed top-4 left-1/2 -translate-x-1/2 bg-gray-900 border border-yellow-400 rounded-lg px-6 py-3 shadow-2xl hidden z-50"></div>
    </div>

    <script>
        let user = null;

        function showTab(name) {
            document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
            document.querySelectorAll('.tab').forEach(el => el.classList.remove('active','text-yellow-400'));
            
            if(name === 'login') {
                document.getElementById('form-login').classList.remove('hidden');
                document.getElementById('form-register').classList.add('hidden');
                return;
            }
            if(name === 'register') {
                document.getElementById('form-register').classList.remove('hidden');
                document.getElementById('form-login').classList.add('hidden');
                return;
            }

            document.getElementById('tab-' + name).classList.remove('hidden');
            event.target.classList.add('active','text-yellow-400');
        }

        function thongBao(msg, type='info') {
            const el = document.getElementById('thong-bao');
            el.textContent = msg;
            el.classList.remove('hidden');
            el.style.borderColor = type==='success'?'#10b981':type==='error'?'#ef4444':'#ffd700';
            setTimeout(()=>el.classList.add('hidden'),3000);
        }

        function capNhatUser() {
            if(user) {
                document.getElementById('user-area').innerHTML = \`
                    <p class="text-lg font-bold">\${user.name}</p>
                    <p class="text-yellow-400 text-xl font-bold">\${Number(user.xu).toLocaleString()} đ</p>
                    <button onclick="dangXuat()" class="mt-2 text-sm text-gray-400">Đăng xuất</button>
                \`;
            }
        }

        async function dangKy() {
            const taikhoan = document.getElementById('reg-user').value.trim();
            const matkhau = document.getElementById('reg-pass').value.trim();
            const name = document.getElementById('reg-ten').value.trim();
            
            if(!taikhoan || !matkhau || !name) return thongBao('Điền đầy đủ thông tin','error');
            
            const res = await fetch('/api/dangky', {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({taikhoan, matkhau, name})
            });
            const data = await res.json();
            thongBao(data.msg, data.ok?'success':'error');
            if(data.ok) showTab('login');
        }

        async function dangNhap() {
            const taikhoan = document.getElementById('login-user').value.trim();
            const matkhau = document.getElementById('login-pass').value.trim();
            
            const res = await fetch('/api/dangnhap', {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({taikhoan, matkhau})
            });
            const data = await res.json();
            if(data.ok) {
                user = data.user;
                localStorage.setItem('user', JSON.stringify(user));
                capNhatUser();
                showTab('game');
                thongBao('Đăng nhập thành công!','success');
            } else {
                thongBao(data.msg,'error');
            }
        }

        function dangXuat() {
            user = null;
            localStorage.removeItem('user');
            location.reload();
        }

        async function datCuoc(loai) {
            if(!user) return thongBao('Vui lòng đăng nhập','error');
            const tien = parseInt(document.getElementById('tien-cuoc').value);
            if(!tien || tien <= 0) return thongBao('Nhập số tiền cược hợp lệ','error');
            if(tien > user.xu) return thongBao('Không đủ số dư','error');
            
            const res = await fetch('/api/datcuoc', {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({uid:user.id, loai, tien})
            });
            const data = await res.json();
            if(data.ok) {
                user.xu = data.xu;
                capNhatUser();
                thongBao('Đặt cược thành công!','success');
            } else {
                thongBao(data.msg,'error');
            }
        }

        async function napTien() {
            if(!user) return thongBao('Vui lòng đăng nhập','error');
            const sotien = parseInt(document.getElementById('nap-so-tien').value);
            const magd = document.getElementById('nap-ma-giao-dich').value.trim();
            
            if(!sotien || !magd) return thongBao('Điền đầy đủ thông tin','error');
            
            const res = await fetch('/api/naptien', {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({uid:user.id, sotien, magd})
            });
            const data = await res.json();
            thongBao(data.msg, data.ok?'success':'error');
        }

        async function rutTien() {
            if(!user) return thongBao('Vui lòng đăng nhập','error');
            const sotien = parseInt(document.getElementById('rut-so-tien').value);
            const nganhang = document.getElementById('rut-ngan-hang').value.trim();
            const stk = document.getElementById('rut-so-tai-khoan').value.trim();
            const tentk = document.getElementById('rut-chu-tai-khoan').value.trim();
            
            if(!sotien || !nganhang || !stk || !tentk) return thongBao('Điền đầy đủ thông tin','error');
            if(sotien < 10000) return thongBao('Tối thiểu rút 10.000đ','error');
            if(sotien > user.xu) return thongBao('Không đủ số dư','error');
            
            const res = await fetch('/api/ruttien', {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({uid:user.id, sotien, nganhang, stk, tentk})
            });
            const data = await res.json();
            thongBao(data.msg, data.ok?'success':'error');
        }

        // Kiểm tra đăng nhập lại
        const saved = localStorage.getItem('user');
        if(saved) {
            user = JSON.parse(saved);
            capNhatUser();
        }
    </script>
</body>
</html>
    `);
});

// ========== API ĐĂNG KÝ ==========
app.post('/api/dangky', async (req, res) => {
    const { taikhoan, matkhau, name } = req.body;
    if(!taikhoan || !matkhau || !name) {
        return res.json({ ok: false, msg: 'Điền đầy đủ thông tin' });
    }
    const mkma = checkstring.password(matkhau);
    mysqli.query("SELECT id FROM `nguoichoi` WHERE `taikhoan` = ?", [taikhoan], (err, kq) => {
        if(kq.length > 0) return res.json({ ok: false, msg: 'Tài khoản đã tồn tại' });
        const thongtin = JSON.stringify({ avatar: '', online: 0 });
        mysqli.query(
            "INSERT INTO `nguoichoi` (`taikhoan`, `matkhau`, `name`, `xu`, `admin`, `thongtin`) VALUES (?, ?, ?, 10000, 0, ?)",
            [taikhoan, mkma, name, thongtin],
            () => res.json({ ok: true, msg: 'Đăng ký thành công! Đăng nhập để chơi' })
        );
    });
});

// ========== API ĐĂNG NHẬP ==========
app.post('/api/dangnhap', async (req, res) => {
    const { taikhoan, matkhau } = req.body;
    mysqli.query("SELECT * FROM `nguoichoi` WHERE `taikhoan` = ?", [taikhoan], (err, users) => {
        if(!users || users.length === 0) {
            return res.json({ ok: false, msg: 'Tài khoản không tồn tại' });
        }
        const u = users[0];
        if(!checkstring.checkpassword(matkhau, u.matkhau)) {
            return res.json({ ok: false, msg: 'Mật khẩu sai' });
        }
        res.json({ ok: true, user: { id: u.id, name: u.name, xu: u.xu, admin: u.admin } });
    });
});

// ========== API ĐẶT CƯỢC ==========
app.post('/api/datcuoc', async (req, res) => {
    const { uid, loai, tien } = req.body;
    mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = ?", [uid], (err, users) => {
        if(!users || users.length === 0) return res.json({ ok: false, msg: 'Không tìm thấy tài khoản' });
        const u = users[0];
        if(u.xu < tien) return res.json({ ok: false, msg: 'Không đủ số dư' });
        
        sodu(uid, -tien, `Đặt cược ${loai}`, 'game');
        res.json({ ok: true, msg: 'Đặt cược thành công', xu: u.xu - tien });
    });
});

// ========== API NẠP TIỀN ==========
app.post('/api/naptien', async (req, res) => {
    const { uid, sotien, magd } = req.body;
    mysqli.query("INSERT INTO `napvang` SET `uid` = ?, `vang_game` = ?, `magiaodich` = ?, `stt` = '0', `date` = ?",
        [uid, sotien, magd, checkstring.time().ngaythangnam],
        () => res.json({ ok: true, msg: '✅ Đã ghi nhận! Chờ duyệt trong vài phút' })
    );
});

// ========== API RÚT TIỀN ==========
app.post('/api/ruttien', async (req, res) => {
    const { uid, sotien, nganhang, stk, tentk } = req.body;
    mysqli.query("SELECT * FROM `nguoichoi` WHERE `id` = ?", [uid], (err, users) => {
        if(!users || users[0].xu < sotien) {
            return res.json({ ok: false, msg: 'Không đủ số dư' });
        }
        sodu(uid, -sotien, `Yêu cầu rút tiền`, 'rutvang');
        mysqli.query(
            "INSERT INTO `rutvang` SET `uid` = ?, `vangnhan` = ?, `nganhang` = ?, `sotaikhoan` = ?, `chutaikhoan` = ?, `trangthai` = 0, `date` = ?",
            [uid, sotien, nganhang, stk, tentk, checkstring.time().ngaythangnam],
            () => res.json({ ok: true, msg: '✅ Yêu cầu đã gửi! Chờ duyệt' })
        );
    });
});

// ========== Cổng chạy ==========
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`✅ Server chạy cổng ${PORT} — NGUYỄN NGỌC VĂN`);
});

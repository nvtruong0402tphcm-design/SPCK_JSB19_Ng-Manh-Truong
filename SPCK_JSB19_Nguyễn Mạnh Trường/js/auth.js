// HIỂN THỊ TRẠNG THÁI ĐĂNG NHẬP
// Chưa đăng nhập: giữ nguyên nút ĐĂNG NHẬP / ĐĂNG KÝ.
// Đã đăng nhập: thay bằng icon + tên người dùng (có menu Đăng xuất).

(function () {
    const vungTaiKhoan = document.getElementById('authArea');
    if (!vungTaiKhoan) return;

    // Đọc trạng thái đăng nhập đã lưu trong localStorage
    const daDangNhap = localStorage.getItem('isLoggedIn') === 'true';
    if (!daDangNhap) return; // chưa đăng nhập thì giữ nguyên 2 nút

    // Lấy tên người dùng (ưu tiên họ tên, không có thì dùng tên đăng nhập)
    const ten = localStorage.getItem('fullname') || localStorage.getItem('username') || 'Bạn';

    // Dựng icon + tên dạng dropdown của Bootstrap
    vungTaiKhoan.innerHTML = `
        <div class="dropdown">
            <button class="btn btn-outline-danger rounded-pill dropdown-toggle" type="button"
                data-bs-toggle="dropdown" aria-expanded="false">
                <i class="fa-solid fa-circle-user me-1"></i><span id="userName"></span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
                <li><h6 class="dropdown-header" id="userGreeting"></h6></li>
                <li><hr class="dropdown-divider"></li>
                <li>
                    <button class="dropdown-item text-danger" type="button" id="logoutBtn">
                        <i class="fa-solid fa-right-from-bracket me-1"></i>Đăng xuất
                    </button>
                </li>
            </ul>
        </div>`;

    // Dùng textContent để chèn tên an toàn (không bị lỗi bảo mật XSS)
    document.getElementById('userName').textContent = ten;
    document.getElementById('userGreeting').textContent = 'Xin chào, ' + ten;

    // Bấm Đăng xuất: xóa trạng thái rồi tải lại trang -> hiện lại 2 nút
    document.getElementById('logoutBtn').addEventListener('click', function () {
        localStorage.removeItem('isLoggedIn');
        location.reload();
    });
})();
// GỌI API LẤY TIN TỨC (GET)
// Trang chủ: lấy tin thật từ VnExpress (qua rss2json) rồi hiển thị vào mục TIN TỨC TRONG NGÀY.

(function () {
    const container = document.getElementById('dailyNews');
    if (!container) return; // chỉ chạy trên trang chủ

    // Đổi ký tự đặc biệt thành dạng an toàn, chống lỗi XSS khi chèn dữ liệu từ API
    function escapeHtml(text) {
        return String(text).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    // Tạo HTML cho một khối tin (giống cấu trúc cũ để giữ giao diện + tìm kiếm)
    function renderCard(item) {
        const imagePart = item.enclosure && item.enclosure.link
            ? '<img src="' + escapeHtml(item.enclosure.link.replace(/&amp;/g, '&')) + '" class="img-fluid rounded-start news-thumb" alt="">'
            : '<div class="news-thumb d-flex align-items-center justify-content-center bg-light text-muted"><i class="fa-solid fa-newspaper fa-2x"></i></div>';
        return '' +
            '<div class="news-item news-daily">' +
            '   <div class="box-category-time time-ago">' +
            '       <small class="time-badge text-muted">' + escapeHtml(item.pubDate || 'Vừa xong') + ' •</small>' +
            '   </div>' +
            '   <div class="container mt-4">' +
            '       <div class="card mb-3 shadow-sm border-0">' +
            '           <div class="row g-0 align-items-center">' +
            '               <div class="col-md-4">' + imagePart + '</div>' +
            '               <div class="col-md-8">' +
            '                   <div class="card-body">' +
            '                       <h4 class="card-title fw-bold"><a href="./chitiet.html?url=' + encodeURIComponent(item.link) + '" class="stretched-link text-decoration-none text-dark">' + escapeHtml(item.title) + '</a></h4>' +
            '                       <p class="card-text text-secondary">' + escapeHtml(item.description.replace(/<[^>]*>/g, '')) + '</p>' + '                   </div>' +
            '               </div>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '   <hr>' +
            '</div>';
    }

    // GET: xin danh sách tin thật từ API rss2json (VnExpress)
    fetch('https://api.rss2json.com/v1/api.json?rss_url=https://vnexpress.net/rss/tin-moi-nhat.rss&count=6')
        .then(function (res) {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.json(); // đổi JSON thành mảng object
        })
        .then(function (data) {
            container.innerHTML = data.items.map(renderCard).join('');
            // Báo cho search.js biết tin đã tải xong để lọc lại (nếu đang gõ từ khóa)
            document.dispatchEvent(new Event('news:loaded'));
        })
        .catch(function () {
            container.innerHTML = '<div class="alert alert-warning">Không tải được tin tức. Kiểm tra kết nối mạng rồi tải lại trang (F5) nha.</div>';
        });
})();
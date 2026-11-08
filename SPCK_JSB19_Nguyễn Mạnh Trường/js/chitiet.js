// TRANG CHI TIẾT: giao diện của mình, nội dung lấy từ VnExpress (qua rss2json)
(function () {
    const container = document.getElementById('articleBody');
    if (!container) return;

    function escapeHtml(text) {
        return String(text).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    const url = new URLSearchParams(location.search).get('url');
    if (!url) {
        container.innerHTML = '<div class="alert alert-warning">Không tìm thấy bài viết. <a href="./trangchu.html">Quay về trang chủ</a>.</div>';
        return;
    }

    fetch('https://api.rss2json.com/v1/api.json?rss_url=https://vnexpress.net/rss/tin-moi-nhat.rss&count=30')
        .then(function (res) {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.json();
        })
        .then(function (data) {
            const item = (data.items || []).find(function (t) { return t.link === url; });
            if (!item) {
                container.innerHTML = '<div class="alert alert-warning">Bài này không còn trong danh sách tin mới. <a href="' + escapeHtml(url) + '" target="_blank" rel="noopener">Đọc trực tiếp trên VnExpress</a> hoặc <a href="./trangchu.html">về trang chủ</a>.</div>';
                return;
            }
            const image = item.enclosure && item.enclosure.link ? item.enclosure.link.replace(/&amp;/g, '&') : '';
            const lead = String(item.description || '').replace(/<[^>]*>/g, '').trim();
            container.innerHTML =
                '<h2 class="fw-bold">' + escapeHtml(item.title) + '</h2>' +
                '<p class="text-muted">' + escapeHtml(item.pubDate || '') + '</p>' +
                (image ? '<img src="' + escapeHtml(image) + '" class="img-fluid rounded mb-3" alt="">' : '') +
                '<p class="fs-5 fw-semibold">' + escapeHtml(lead) + '</p>' +
                '<p class="text-muted mt-3 mb-0"><small>Nguồn: <a href="' + escapeHtml(item.link) + '" target="_blank" rel="noopener" class="text-danger">VnExpress — xem bài gốc</a></small></p>';
        })
        .catch(function () {
            container.innerHTML = '<div class="alert alert-warning">Không tải được nội dung. Kiểm tra mạng rồi tải lại (F5), hoặc <a href="' + escapeHtml(url) + '" target="_blank" rel="noopener">đọc trên VnExpress</a>.</div>';
        });
})();
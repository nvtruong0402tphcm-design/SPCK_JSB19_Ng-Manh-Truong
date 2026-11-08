// CHỨC NĂNG TÌM KIẾM TIN TỨC
// Gõ từ khóa tới đâu lọc tin tới đó trên trang chủ.
// Ở trang khác, bấm tìm kiếm sẽ chuyển về trang chủ kèm từ khóa.

(function () {
    const form = document.querySelector('form[role="search"]');
    if (!form) return;
    const input = form.querySelector('input[type="search"]');

    // Trang chủ có vùng dailyNews (tin tải từ API)
    const isHome = !!document.getElementById('dailyNews');

    // Hàm lọc tin theo từ khóa
    function locTin(keyword) {
        const kw = keyword.trim().toLowerCase();
        let count = 0;
        // Lấy lại danh sách khối tin mỗi lần lọc (tin từ API có thể vừa tải xong)
        const items = document.querySelectorAll('.news-item');

        items.forEach(function (item) {
            // Lấy toàn bộ chữ trong khối tin, đổi thành chữ thường
            const text = item.textContent.toLowerCase();
            const match = kw === '' || text.includes(kw);
            // Không khớp thì ẩn (d-none), khớp thì hiện
            item.classList.toggle('d-none', !match);
            if (match) count++;
        });

        // Hiện thông báo khi không tìm thấy tin nào
        const noResults = document.getElementById('noResults');
        if (noResults) {
            noResults.classList.toggle('d-none', count > 0 || kw === '');
        }

        // Ẩn tiêu đề mục "TIN TỨC TRONG NGÀY" nếu mục đó không còn tin nào
        const header = document.querySelector('.news-section-header');
        if (header) {
            const dailyCon = document.querySelectorAll('.news-daily:not(.d-none)').length;
            header.classList.toggle('d-none', kw !== '' && dailyCon === 0);
        }
    }

    // Bấm nút tìm kiếm (hoặc Enter)
    form.addEventListener('submit', function (e) {
        e.preventDefault(); // chặn load lại trang
        const kw = input.value.trim();
        if (isHome) {
            locTin(kw);
        } else {
            // Trang khác: chuyển về trang chủ, kèm từ khóa trên URL
            window.location.href = './trangchu.html?search=' + encodeURIComponent(kw);
        }
    });

    if (isHome) {
        // Gõ tới đâu lọc tới đó
        input.addEventListener('input', function () {
            locTin(input.value);
        });

        // Tin từ API tải xong thì lọc lại theo từ khóa hiện tại
        document.addEventListener('news:loaded', function () {
            locTin(input.value);
        });

        // Nếu được chuyển từ trang khác về (?search=...) thì lọc luôn
        const q = new URLSearchParams(window.location.search).get('search');
        if (q) {
            input.value = q;
            locTin(q);
        }
    }
})();
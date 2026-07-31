/**
 * VOLC TOOLS 共通サイドバーコンポーネント
 * メニュー項目を変更する場合は、このファイルの sidebarHTML を編集してください。
 */
(function() {
    const sidebarHTML = `
        <div class="sidebar-brand" style="padding: 40px 24px 32px;">
            <a href="index.html" style="text-decoration: none; color: inherit; display: block; line-height: 0.8;">
                <div style="font-size: 3.2rem; font-weight: 900; letter-spacing: -3px; color: #1e293b; text-shadow: 2px 2px 0px #fff, 5px 5px 0px rgba(0,0,0,0.06); position: relative;">
                    <span style="color: #ff3b3b; filter: drop-shadow(2px 2px 0px rgba(255,59,59,0.15));">V</span>OLC
                </div>
                <div style="font-size: 0.75rem; color: #94a3b8; font-weight: 800; margin-top: 12px; letter-spacing: 0.4em; text-transform: uppercase; padding-left: 4px;">ヴォルク ツールズ</div>
            </a>
        </div>
        <nav>
            <div class="nav-group" data-group="ai">
                <div class="nav-header">
                    <span class="nav-label">AI Magic</span>
                    <span class="nav-arrow"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
                </div>
                <div class="nav-list">
                    <div class="nav-list-inner">
                        <a href="background-remover.html" class="nav-item">背景透過AI</a>
                        <a href="image-upscaler.html" class="nav-item">アップスケーラーAI</a>
                        <a href="object-remover.html" class="nav-item">消しゴムマジックAI</a>
                        <a href="summarizer.html" class="nav-item">感情分析・要約AI</a>
                        <a href="ocr.html" class="nav-item">画像文字起こしAI</a>
                    </div>
                </div>
            </div>
            <div class="nav-group" data-group="converters">
                <div class="nav-header">
                    <span class="nav-label">File Converters</span>
                    <span class="nav-arrow"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
                </div>
                <div class="nav-list">
                    <div class="nav-list-inner">
                        <a href="webp-converter.html" class="nav-item">WebPコンバーター</a>
                        <a href="audio-converter.html" class="nav-item">Audioコンバーター</a>
                        <a href="svg-to-png.html" class="nav-item">SVG ↔ PNG 変換</a>
                        <a href="pdf-to-image.html" class="nav-item">PDF画像変換</a>
                    </div>
                </div>
            </div>
            <div class="nav-group" data-group="utilities">
                <div class="nav-header">
                    <span class="nav-label">Design & Utilities</span>
                    <span class="nav-arrow"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
                </div>
                <div class="nav-list">
                    <div class="nav-list-inner">
                        <a href="image-resizer.html" class="nav-item">画像リサイズ</a>
                        <a href="qr-generator.html" class="nav-item">QRコード作成</a>
                        <a href="password-generator.html" class="nav-item">パスワード生成器</a>
                        <a href="metadata-cleaner.html" class="nav-item">Metadata Eraser</a>
                        <a href="character-counter.html" class="nav-item">文字数カウント</a>
                        <a href="color-palette.html" class="nav-item">配色抽出</a>
                    </div>
                </div>
            </div>
        </nav>
    `;

    const footerHTML = `
        <div id="footer-view-all" style="text-align: center; margin-top: 60px; margin-bottom: 32px;">
            <a href="index.html" class="view-all-link">
                <span>他のツールを見る</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </a>
        </div>
        <footer class="tool-footer">
            &copy; 2026 <a href="https://volcane.pages.dev/" style="font-weight: 600;">Volcane</a>. 
            <a href="https://volcane.pages.dev/privacy-policy.html" style="margin-left: 10px; text-decoration: underline;">Privacy Policy</a>
        </footer>
    `;

    const initSidebar = () => {
        const container = document.getElementById('sidebar-placeholder');
        if (!container) return;

        container.innerHTML = sidebarHTML;

        // アコーディオンのトグルイベント設定
        container.querySelectorAll('.nav-header').forEach(header => {
            header.addEventListener('click', function(e) {
                e.preventDefault();
                const group = this.closest('.nav-group');
                const isOpen = group.classList.contains('is-open');
                
                // トグル実行
                group.classList.toggle('is-open', !isOpen);
            });
        });

        // 現在のページに基づいて「active」クラスを自動付与
        const currentPage = window.location.pathname.split("/").pop() || 'index.html';
        
        // 通常のリンクアイテム（ツール個別ページ）を検索
        const activeLink = container.querySelector(`nav a[href="${currentPage}"]`);
        
        if (activeLink) {
            activeLink.classList.add('active');
            // インラインスタイルも適用（CSSで定義されていない場合のため）
            activeLink.style.background = 'var(--color-hover)';
            activeLink.style.color = 'var(--color-primary)';

            // アクティブな項目が含まれるグループを自動で開く
            const parentGroup = activeLink.closest('.nav-group');
            if (parentGroup) parentGroup.classList.add('is-open');
        } else {
            // ツールページでなければ、カテゴリハブページ自体のURLかどうかを判定
            const catPages = {
                'ai-magic.html': 'ai',
                'converters.html': 'converters',
                'design-utilities.html': 'utilities'
            };
            const groupId = catPages[currentPage];
            if (groupId) {
                const group = container.querySelector(`.nav-group[data-group="${groupId}"]`);
                if (group) {
                    group.classList.add('is-open');
                    const label = group.querySelector('.nav-label');
                    if (label) label.style.color = 'var(--color-primary)';
                }
            }
        }

        // フッターの注入
        const footerContainer = document.getElementById('footer-placeholder');
        if (footerContainer) {
            footerContainer.innerHTML = footerHTML;

            // ツールのトップページ（index.html）では「他のツールを見る」ボタンを非表示にする
            const footerViewAll = document.getElementById('footer-view-all');
            if (footerViewAll && (currentPage === 'index.html' || currentPage === '')) {
                footerViewAll.style.display = 'none';
            }
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSidebar);
    } else {
        initSidebar();
    }
})();
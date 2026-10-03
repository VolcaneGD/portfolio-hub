(() => {
  const section = document.getElementById('updates');
  if (!section) return;
  const items = [...section.querySelectorAll('.update-item')];
  const toggle = document.getElementById('updates-toggle');
  const previous = document.getElementById('updates-previous');
  const next = document.getElementById('updates-next');
  const pagination = document.getElementById('updates-pagination');
  const status = document.getElementById('updates-status');
  let expanded = false;
  let page = 0;
  const pageCount = Math.ceil(items.length / 20);
  function render() {
    const start = expanded ? page * 20 : 0;
    const end = Math.min(start + (expanded ? 20 : 5), items.length);
    items.forEach((item, index) => {
      item.hidden = index < start || index >= end;
      if (!item.hidden) item.classList.add('visible');
    });
    toggle.hidden = items.length <= 5;
    toggle.textContent = expanded ? '閉じる（最新5件）' : '過去のお知らせを表示';
    toggle.setAttribute('aria-expanded', String(expanded));
    pagination.hidden = !expanded || pageCount <= 1;
    previous.disabled = page === 0;
    next.disabled = page >= pageCount - 1;
    status.textContent = expanded ? `${start + 1}–${end}件 / 全${items.length}件（${page + 1} / ${pageCount}ページ）` : `最新${end}件 / 全${items.length}件`;
  }
  toggle.addEventListener('click', () => {
    expanded = !expanded;
    page = 0;
    render();
    if (!expanded) section.scrollIntoView({ block: 'start', behavior: 'instant' });
  });
  function navigate(delta) {
    page = Math.min(pageCount - 1, Math.max(0, page + delta));
    render();
    section.scrollIntoView({ block: 'start', behavior: 'instant' });
  }
  previous.addEventListener('click', () => navigate(-1));
  next.addEventListener('click', () => navigate(1));
  render();
})();

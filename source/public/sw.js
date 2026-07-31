const CACHE_NAME = 'volcane-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/app-details.css',
  '/script.js',
  '/manifest.json',
  '/images/favicon.ico'
];

/**
 * Install Event: 資産をキャッシュする
 */
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('SW: Pre-caching assets');
      return cache.addAll(ASSETS);
    })
  );
  // 新しいSWをすぐにアクティブにする
  self.skipWaiting();
});

/**
 * Activate Event: 古いキャッシュのクリーンアップ
 */
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('SW: Clearing old cache', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => {
        // 全てのクライアントを制御下におく
        return self.clients.claim();
    })
  );
});

/**
 * Fetch Event: キャッシュ優先 (存在しない場合はネットワークから)
 */
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request).then((fetchRes) => {
        // 動的なキャッシュ追加（オプション）
        // return caches.open(CACHE_NAME).then(cache => {
        //   cache.put(e.request.url, fetchRes.clone());
        //   return fetchRes;
        // });
        return fetchRes;
      });
    })
  );
});
// 이제부터는 버전 번호를 손으로 올릴 필요가 없습니다.
// "네트워크 우선" 방식으로 바꿔서, 인터넷이 연결돼 있으면 항상 서버의 최신 파일을
// 먼저 가져오고, 화면에 그걸 보여줍니다. 캐시는 오프라인일 때만 백업으로 씁니다.
// (= index.html을 아무리 자주 바꿔도 이 sw.js 파일 자체는 다시 손댈 필요가 없습니다.)

const CACHE_NAME = 'vocab-bench-cache';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // HTML 문서(페이지 자체)는 항상 네트워크를 먼저 시도해서 최신 버전을 보여준다.
  // 실패하면(오프라인 등) 캐시에 저장해둔 마지막 버전을 대신 보여준다.
  const isNavigationRequest = event.request.mode === 'navigate';
  const isHtml = event.request.destination === 'document' || isNavigationRequest;

  if (isHtml) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // 그 외 리소스(아이콘, manifest 등)는 기존처럼 캐시를 먼저 보여주고 백그라운드로 갱신한다.
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});

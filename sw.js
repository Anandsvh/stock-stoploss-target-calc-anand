self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("sl-target-cache").then(cache => {
      return cache.addAll([
        "./index.html",
        "./manifest.json",
        "./avk_logo.png"
      ]);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
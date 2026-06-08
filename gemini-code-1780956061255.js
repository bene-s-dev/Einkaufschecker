self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open('einkaufschecker-v1').then((cache) => {
            return cache.addAll(['./index.html', './manifest.json']);
        })
    );
});
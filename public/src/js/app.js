if (!window.Promise) {
    window.Promise = Promise;
}

// Если поддержываются воркеры
if ('serviceWorker' in navigator) {
    // загрузить их из файла
    navigator
        .serviceWorker
        // .register('/sw.js', {scope: '/help/'})
        .register('/sw.js')
        .then(function () {
            console.log('Service worker registered!');
        });
}

window.addEventListener('beforeinstallprompt', function (event) {
    console.log('beforeinstallprompt fired');
    event.preventDefault();
    deferrerPrompt = event;

    return false;
});

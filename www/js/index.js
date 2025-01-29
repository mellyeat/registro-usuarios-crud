document.addEventListener('deviceready', function() {
    console.log('Device is ready');
}, false);

function exitApplication() {
    navigator.app.exitApp();
}
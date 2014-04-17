/* function to load settings *//*
function loadSettings()
{
    *//* load icon option *//*
    var parseIcon = {
        dark: 0,
        light: 1
    };
    document.querySelectorAll('input[name="icon"]')[parseIcon[localStorage.gml_icon]].checked = true;

    *//* load seconds option *//*
    var parseSeconds = {
        60: 0,
        300: 1,
        900: 2,
        1800: 3,
        3600: 4,
        7200: 5,
        14400: 6
    };
    document.querySelectorAll('select[name="seconds"]')[0].selectedIndex = parseSeconds[localStorage.gml_seconds];
}


*//* save settings function *//*
function saveSettings()
{
    *//* grab the selected values *//*
    var selected_icon = document.querySelectorAll('input[name="icon"]:checked')[0].value;
    var selected_seconds = document.querySelectorAll('select[name="seconds"]')[0].options[document.querySelectorAll('select[name="seconds"]')[0].selectedIndex].value;
    var selected_sound_notification = document.querySelectorAll('select[name="sound_notification"]')[0].options[document.querySelectorAll('select[name="sound_notification"]')[0].selectedIndex].value;

    *//* store with localStorage *//*
    localStorage.gml_icon = selected_icon;
    localStorage.gml_seconds = selected_seconds;
    localStorage.gml_sound_notification = selected_sound_notification;

    *//* alert the user *//*
    document.querySelectorAll('#alert')[0].innerHTML = "Saved! This window will auto-close in 2 seconds.";

    *//* change icon *//*
    chrome.browserAction.setIcon({path: "img/icon_"+localStorage.gml_icon+".png"});

    *//* reload extension *//*
    chrome.extension.getBackgroundPage().window.location.reload();

    *//* close the window *//*
    setTimeout(function(){
        window.close()
    },2000);
}

*//* event handler *//*
document.addEventListener('DOMContentLoaded', loadSettings);
document.querySelector('#save').addEventListener('click', saveSettings);*/




/* ---- COPY\PASTE ----- */

Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
};

Storage.prototype.getObject = function(key, def) {
    var value = this.getItem(key);
    var obj = window.JSON.parse(value);
    if (obj) {
        return obj;
    } else if (def) {
        return def;
    }
};

window.options = {

    init: function(debug) {
        for (var prop in options.defaults) {
            var stored = options.stored[prop];
            var debug_value = options.debug[prop];
            if (typeof stored !== 'undefined') {
                options.current[prop] = stored;
            } else if (debug && typeof debug_value !== 'undefined') {
                options.current[prop] = debug_value;
            } else {
                options.current[prop] = options.defaults[prop];
            }
        }
        options.save();
        return options;
    },

    initDebug: function() {
        options.reset();
        return options.init(true);
    },

    save: function() {
        window.localStorage.setObject('options', window.options.current);
        return options;
    },

    reset: function() {
        options.stored = options.current = {};
        options.save();
        return options;
    },

    defaults: {
        popupEndpoint: '/desktop_notifications/popup.php',
        refreshTime: 30000,
        markAsRead: true,
        domain: 'www.facebook.com',
        protocol: 'https://'
    },

    debug: {
        refreshTime: 5000,
        markAsRead: false,
        domain: 'www.dev.facebook.com',
        protocol: 'http://'
    },

    stored: window.localStorage.getObject('options', {}),

    current: {}

};

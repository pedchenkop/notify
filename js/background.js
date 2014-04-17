/* -- FB 1 -- */
/*window.fbAsyncInit = function() {
    FB.init({
        appId      : '199493976841002',
        status     : true,
        xfbml      : true
    });
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/all.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

 FB.getLoginStatus(function(response) {
 if (response.status === 'connected') {
 // the user is logged in and has authenticated your
 // app, and response.authResponse supplies
 // the user's ID, a valid access token, a signed
 // request, and the time the access token
 // and signed request each expire
 var uid = response.authResponse.userID;
 var accessToken = response.authResponse.accessToken;
 alert(accessToken);
 } else if (response.status === 'not_authorized') {
 // the user is logged in to Facebook,
 // but has not authenticated your app
 } else {
 // the user isn't logged in to Facebook.
 }
 });
*/

/* -- FB2 -- */
/*
chrome.tabs.onUpdated.addListener(function(){

    // save access_token
    var lis = this;
    if (!localStorage.access_token) {
        chrome.tabs.getAllInWindow(null, function(tabs) {
            for (var i = 0; i < tabs.length; i++) {
                if (tabs[i].url.indexOf('https://www.facebook.com/connect/login_success.html') == 0) {
                    var params = tabs[i].url.split('#')[1];
                    access = params.split('&')[0];
                    alert(access);
                    localStorage.access_token = access;
                    chrome.tabs.onUpdated.removeListener(lis);
                    return;
                }
            }
        });
    }
});
*/
/* -- FB3 -- */
/*
 var fbAppId = '199493976841002';

 window.fbAsyncInit = function () {
 FB.init({ appId: fbAppId, status: true, cookie: true,
 xfbml: true
 });
 };
 $(document).ready(function(){
 (function () {
 var e = document.createElement('script');
 e.type = 'text/javascript';
 e.src = document.location.protocol +
 '//connect.facebook.net/en_US/all.js';
 e.async = true;
 console.log(e);
 var fb = document.getElementById("fb-root");
 fb.appendChild(e);
 } ());
 });
 */


/* --------VK.com----------*/

var vk_count = 0;
var gmail_count = 0;
var fb_count = 0;
var fb_notifications = 0;
var fb_notif_url = "https://graph.facebook.com/me/notifications?";
var fb_message_url = "https://graph.facebook.com/me/conversations?";
var fb_friends_url = "https://graph.facebook.com/me/conversations?";

function getUrlParameterValue(url, parameterName) {
    "use strict";

    var urlParameters  = url.substr(url.indexOf("#") + 1),
        parameterValue = "",
        index,
        temp;

    urlParameters = urlParameters.split("&");

    for (index = 0; index < urlParameters.length; index += 1) {
        temp = urlParameters[index].split("=");

        if (temp[0] === parameterName) {
            return temp[1];
        }
    }

    return parameterValue;
}

function listenerHandler(authenticationTabId, imageSourceUrl) {
    "use strict";

    return function tabUpdateListener(tabId, changeInfo) {
        var vkAccessToken, vkAccessTokenExpiredFlag;

        if (tabId === authenticationTabId && changeInfo.url !== undefined && changeInfo.status === "loading") {

            if (changeInfo.url.indexOf('oauth.vk.com/blank.html') > -1) {
                authenticationTabId = null;
                chrome.tabs.onUpdated.removeListener(tabUpdateListener);

                vkAccessToken = getUrlParameterValue(changeInfo.url, 'access_token');

                vkAccessTokenExpiredFlag = Number(getUrlParameterValue(changeInfo.url, 'expires_in'));

                chrome.storage.local.set({'vkaccess_token': vkAccessToken}, function () {
                    chrome.tabs.update(
                        tabId,
                        {
                            'url'   : 'chrome://newtab',
                            'active': false
                        },
                        function (tab) {}
                    );
                });
            }
        }
    };
}

function getClickHandler() {
    "use strict";

    return function (info, tab) {

        fb_notifications = 0;
        var vkCLientId           = '4308531',
            vkRequestedScopes    = 'notify,offline',
            vkAuthenticationUrl  = 'https://oauth.vk.com/authorize?client_id=' + vkCLientId + '&scope=' + vkRequestedScopes + '&redirect_uri=http%3A%2F%2Foauth.vk.com%2Fblank.html&display=page&response_type=token';

        chrome.storage.local.get({'vkaccess_token': {}}, function (items) {

            if (items.vkaccess_token.length === undefined) {
                chrome.tabs.create({url: vkAuthenticationUrl, selected: true}, function (tab) {
                    chrome.tabs.onUpdated.addListener(listenerHandler(tab.id, "tandmstudio.com"));
                });

                return;
            }

            $.ajax({
                url: 'https://api.vk.com/method/account.getCounters?access_token=' + items.vkaccess_token,
                type: 'GET',
                success: function(data){

                    //console.log(data.response.messages.length);
                    if(!isNaN(data.response.messages)) {
                        vk_count = parseInt(data.response.messages);

                    }
                    else {
                        vk_count = 0;
                    }
                }
            });

        });

        /* -----------GMAIL------------*/
        $.ajax({
            type: "GET",
            url: 'https://mail.google.com/mail/feed/atom',
            dataType: "xml",
            success: function(data2){

                gmail_count = parseInt(data2.getElementsByTagName('fullcount')[0].textContent);

                if (gmail_count <= 0 ) gmail_count = 0;
            }
        });


        /* -----------FACEBOOK------------*/
/*
        $.ajax({
            type: "GET",
            url: fb_notif_url + localStorage.accessToken + "&?include_read=true",
            dataType: "json",
            async: false,
            success: function(data3){

                for(var i = 0; data3.data[i] < data3.data.length; i++){
                    if(data3.data[i].unread == 1){
                        fb_notifications++;
                        console.log("notification +1");
                    }
                }
            }
        });

        $.ajax({
            type: "GET",
            url: fb_message_url + localStorage.accessToken + "&?fields=unread_count&limit=20",
            dataType: "json",
            async: false,
            success: function(data4){

                for(var i = 0; i < data4.data.length; i++){
                    if(data4.data[i].unread_count === 1){
                        fb_notifications++;
                        console.log("message +1");
                    }
                }

            }
        });

        $.ajax({
            type: "GET",
            url: fb_message_url + localStorage.accessToken + "&?fields=unread_count&limit=20",
            dataType: "json",
            async: false,
            success: function(data4){

                for(var i = 0; i < data4.data.length; i++){
                    if(data4.data[i].unread_count === 1){
                        fb_notifications++;
                        console.log("message +1");
                    }
                }

            }
        });
*/
        var self = DesktopNotifications;
        fb_notifications = self._num_unread_notif + self._num_unread_inbox;
        //alert(fb_notifications);
        checkCount(vk_count, gmail_count, fb_notifications);
    };

}

var delay = 1000 * 60 * 0.5; //check minutes
window.onload = getClickHandler();
setInterval(getClickHandler(), delay);

function checkCount(vk,gmail,facebook) {

    var total_count = parseInt(vk) + parseInt(gmail) + facebook;
    //alert("fb counter: "+fb_notifications);
    if(total_count > 0) {
        chrome.browserAction.setBadgeText({text: total_count.toString()});
    }
    else if(total_count == 0) {
        chrome.browserAction.setBadgeText({text: ""});
    }
}






/* ------------ COPY/PASTE ---------------- */
DesktopNotifications = {

    DEFAULT_FADEOUT_DELAY: 20000,
    CLOSE_ON_CLICK_DELAY: 300,

    COUNTER_BLINK_DELAY: 250,

    notifications: {},
    _timer: null,

    PERMISSION_ALLOWED: 0,
    PERMISSION_NOT_ALLOWED: 1,
    PERMISSION_DENIED: 2,

    getEndpoint: '/desktop_notifications/popup.php',
    countsEndpoint: '/desktop_notifications/counts.php',
    domain: '',
    protocol: '',

    _interval: null,

    _latest_notif: 0,
    _latest_read_notif: 0,
    _ignore_notif: {},

    _num_unread_notif: 0,
    _num_unread_inbox: 0,

    fb_dtsg: '',

    _sound: null,
    _sound_playing: false,

    /**
     * Start polling for notifications.
     */
    start: function(refresh_time) {
        var self = DesktopNotifications;
        if (refresh_time < self.DEFAULT_FADEOUT_DELAY) {
            refresh_time = self.DEFAULT_FADEOUT_DELAY;
        }

        self.stop();
        self.showActiveIcon();
        self.fetchServerInfo(self.handleServerInfo, self.showInactiveIcon);

        self._interval = setInterval(function() {
            self.fetchServerInfo(
                function(serverInfo) {
                    self.handleServerInfo(serverInfo);
                    self.showActiveIcon();
                },
                self.showInactiveIcon);
        }, refresh_time);
    },

    /**
     * Get the best popup type to show.
     */
    getPopupType: function() {
        var self = DesktopNotifications;

        var type = 'notifications';
        if (self._num_unread_inbox && !self._num_unread_notif) {
            type = 'inbox';
        }
        return type;
    },

    /**
     * Stop polling.
     */
    stop: function() {
        clearInterval(DesktopNotifications._interval);
        DesktopNotifications.showInactiveIcon();
    },

    /**
     * Updates icon in Chrome extension to normal blue icon
     */
    showActiveIcon: function() {
        /*if (chrome && chrome.browserAction) {
            chrome.browserAction.setIcon({path: '/images/icon19.png'});
        }*/
    },

    /**
     * Updates icon in Chrome extension to gray icon and clears badge.
     */
    showInactiveIcon: function() {
        /*if (chrome && chrome.browserAction) {
            chrome.browserAction.setBadgeText({text: ''});
            chrome.browserAction.setIcon({path: '/images/icon-loggedout.png'});
        }*/
    },

    /**
     * Fetches metadata from the server on the current state of the user's
     * notifications and inbox.
     */
    fetchServerInfo: function(callback, errback, no_cache) {
        callback = callback || function(d) { console.log(d); };
        errback = errback || function(u, e) { console.error(u, e); };
        var self = DesktopNotifications;
        var uri = self.protocol + self.domain + self.countsEndpoint;
        if (no_cache) {
            uri += '&no_cache=1';
        }
        self._fetch(
            uri,
            function(json) {
                callback(JSON.parse(json));
            },
            errback
        );
    },

    _fetch: function(uri, callback, errback) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", uri, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                try {
                    if (xhr.status == 200) {
                        return callback(xhr.responseText);
                    } else {
                        throw 'Status ' + xhr.status + ': ' + xhr.responseText;
                    }
                } catch (e) {
                    errback(e, uri);
                }
            }
        };
        xhr.send(null);
    },

    /**
     * Decides whether to fetch any items for display depending on data from
     * server on unread counts.
     */
    handleServerInfo: function(serverInfo) {
        var self = DesktopNotifications;
        // update CSRF token
        self.fb_dtsg = serverInfo.fb_dtsg;

        self._sound_playing = false;
        self._handleNotifInfo(serverInfo.notifications);
        self._handleInboxInfo(serverInfo.inbox);
    },

    _handleNotifInfo: function(notifInfo) {
        var self = DesktopNotifications;
        if (!notifInfo || notifInfo.no_change) {
            return;
        }
        if (self._num_unread_notif + Object.keys(self._ignore_notif).length <= notifInfo.num_unread) {
            if (self._latest_notif < notifInfo.latest) {
                self._latest_notif = notifInfo.latest;
                self._ignore_notif = notifInfo.unread;
                self._num_unread_notif = notifInfo.num_unread;
                self.addNotificationByType('notifications');
            } else {
                self.updateUnreadCounter();
            }
        } else {
            for (var ignored in self._ignore_notif)
                if (!notifInfo.unread.hasOwnProperty(ignored))
                    delete self._ignore_notif[ignored];
            self._num_unread_notif = notifInfo.num_unread - Object.keys(self._ignore_notif).length;
            self.updateUnreadCounter();
        }
    },

    _handleInboxInfo: function(inboxInfo) {
        var self = DesktopNotifications;
        if (!inboxInfo) {
            return;
        }
        if (inboxInfo.unread !== self._num_unread_inbox) {
            if (inboxInfo.unread > self._num_unread_inbox) {
                self.addNotificationByType('inbox');
            }
            self._num_unread_inbox = inboxInfo.unread;
            self.updateUnreadCounter();
        }
    },

    /**
     * Updates "badge" in Chrome extension toolbar icon.
     */
    updateUnreadCounter: function() {
        var self = DesktopNotifications;
        if (chrome && chrome.browserAction) {
            // first set the counter to empty
            //chrome.browserAction.setBadgeText({text: ''});
            // wait, then set it to new value
            setTimeout(function() {
                    // don't show a zero
                    var num = (self.getUnreadCount() || '') + '';
                    //chrome.browserAction.setBadgeText({text: num});
                },
                self.COUNTER_BLINK_DELAY,
                false
            );
        }
    },

    getUnreadCount: function() {
        var self = DesktopNotifications;
        return self._num_unread_notif + self._num_unread_inbox;
    },

    addNotificationByType: function(type) {
        var self = DesktopNotifications;
        var uri = self.protocol + self.domain + self.getEndpoint +
            '?type=' + (type || '');

        self._fetch(uri, function(result) {
            var capType = type.charAt(0).toUpperCase() + type.slice(1);
            var attributes = self['parse' + capType + 'Attributes'](result);

            for (var i = 0; i < attributes.length; i++) {
                chrome.notifications.create(attributes[i][0], {
                    type: "basic",
                    title: "Facebook - New Messages in " + capType,
                    message: attributes[i][2],
                    iconUrl: "img/icon48.png"
                }, function(id) {
                    self.restartTimer(self.DEFAULT_FADEOUT_DELAY);
                });
                self.notifications[attributes[i][0]] = attributes[i][1];
                delete self._ignore_notif[attributes[i][0]];
            };
            if (type === 'notifications') {
                self._num_unread_notif = attributes.length;
                self.updateUnreadCounter();
            };
        }, function(e, uri) { /* do nothing */ });
    },

    parseNotificationsAttributes: function(result) {
        var self = DesktopNotifications;
        var attributes = [];
        var dom = self.wrap(result, 'html');
        var liElements = dom.getElementsByClassName('jewelItemNew');
        for (var i = liElements.length - 1; i >= 0; i--) {
            var notificationId = liElements[i].id;
            var target = liElements[i].getElementsByTagName('a')[0].href;
            var divs = liElements[i].getElementsByTagName('div');
            for (var j = 0; j < divs.length; j++) {
                if (divs[j].id && divs[j].id.indexOf(notificationId) == 0)
                    var message = divs[j].innerText;
            };
            attributes.push([notificationId.substring(13), target, message]);
        };
        return attributes;
    },

    parseInboxAttributes: function(result) {
        var self = DesktopNotifications;
        var attributes = [];
        var dom = self.wrap(result, 'html');
        var liElements = dom.getElementsByClassName('jewelItemNew');
        for (var i = liElements.length - 1; i >= 0; i--) {
            var target = self.protocol + self.domain + '/messages' +
                liElements[i].getElementsByTagName('a')[0].search;
            var divs = liElements[i].getElementsByClassName('content')[0].childNodes;
            var notificationId = divs[0].innerText;
            var message = '';
            for (var j = 0; j < divs.length; j++)
                message += divs[j].innerText + '\n';
            attributes.push([notificationId, target, message]);
        };
        return attributes;
    },

    expireNotifications: function() {
        for (var id in DesktopNotifications.notifications)
            chrome.notifications.clear(id, function() {});
        DesktopNotifications.notifications = {};
        DesktopNotifications._timer = null;
    },

    restartTimer: function(extraTime) {
        if (DesktopNotifications._timer) {
            clearTimeout(DesktopNotifications._timer);
        }
        DesktopNotifications._timer = setTimeout(function() {
            DesktopNotifications.expireNotifications();
        }, extraTime);
    },

    updateTab: function(href) {
        chrome.tabs.query({ url: href }, function(tabs) {
            if (tabs.length !== 0) {
                chrome.tabs.update(tabs[0].id, { url: href, active: true });
            } else {
                chrome.tabs.create({ url: href });
            }
        });
    },

    wrap: function(string, element) {
        var node = document.createElement(element);
        node.innerHTML = string;
        return node;
    },
};

window.options.init();
var current = window.options.current;
chrome.notifications.onClicked.addListener(function(id) {
    var target = DesktopNotifications.notifications[id];
    DesktopNotifications.updateTab(target);
});

DesktopNotifications.protocol = current.protocol;
DesktopNotifications.domain = current.domain;
DesktopNotifications.start(current.refreshTime);






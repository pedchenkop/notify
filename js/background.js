chrome.tabs.onUpdated.addListener(function(){
    // token deadline check
    var graphUrl = "https://graph.facebook.com/me/events?" + localStorage.access_token + "&fields=id,name,start_time&limit=5";

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
        if (!localStorage.accessToken) {
            onFacebookLogin();
        }

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








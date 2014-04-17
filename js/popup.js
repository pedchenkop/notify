$(document).ready(function() {

    var background = chrome.extension.getBackgroundPage();

    $("#vk_count").text(background.vk_count);
    $("#gmail_count").text(background.gmail_count);
    $("#fb_count").text(background.fb_notifications);


    var total_count = background.vk_count + background.gmail_count + background.fb_notifications;
    if(total_count > 0) chrome.browserAction.setBadgeText({text: total_count.toString()});

    if (localStorage.accessToken) {
        var graphUrl = "https://graph.facebook.com/me/notifications?" + localStorage.accessToken;
        console.log(graphUrl);

    }

});
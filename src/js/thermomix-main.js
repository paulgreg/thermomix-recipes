(function (App, $, undefined) {
    "use strict";

    // Namespaces
    App.categories = {};
    App.recipes = {};
    App.recipe = {};

    { // Markdown converter
        App.converter = Markdown.getSanitizingConverter();

        var baseUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;

        App.converter.hooks.chain("preConversion", function (text) {
            var t = text.replace(/!\[([^\]]*)\]\(([^\)]*)\)/g, function(matcher, desc, img) {
                return '!['+desc+']('+baseUrl+img+')';
            });
            return t;
        });
    }

    { // Block edit/save/delete when offline
        $(function() {
            var $connectionStatus = $('#connection-status');
            var online = true;
            var setReadOnly = function() {
                if (online) {
                    online = false;
                    $connectionStatus.find('.online').hide();
                    $connectionStatus.find('.offline').show();
                    $('a.action').each(function(i, a) {
                        $(a).hide();
                    });
                }
            };

            window.addEventListener("offline", setReadOnly, false);
            window.addEventListener("online", function() {
                if (!online) {
                    online = true;
                }
            }, false);

            if (!navigator.onLine) {
                setReadOnly();
            }
        });
    }

}(window.App = window.App || {}, jQuery));

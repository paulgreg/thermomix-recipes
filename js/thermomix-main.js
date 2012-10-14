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
            var setReadOnly = function() {
                $connectionStatus.find('.online').hide();
                $connectionStatus.find('.offline').show();
                $('a.action').each(function(i, a) {
                    $(a).hide();
                });
                alert('La connection semble avoir été perdue. Seule la consultation est possible.');
            };

            window.addEventListener("offline", setReadOnly, false);
            window.addEventListener("online", function() {
                alert('La connection semble avoir été retrouvé, veuillez rafraîchir la page pour pouvoir à nouveau ajouter, modifier ou supprimer des recettes ou catégories.');
            }, false);

            if (!navigator.onLine) setReadOnly();
        });
    }

}(window.App = window.App || {}, jQuery));

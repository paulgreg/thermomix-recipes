(function (App, $, undefined) {
    "use strict";

    // Namespaces
    App.categories = {};
    App.recipes = {};
    App.recipe = {};


    App.converter = Markdown.getSanitizingConverter(); 

    var baseUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;

    App.converter.hooks.chain("preConversion", function (text) {
        var t = text.replace(/!\[([^\]]*)\]\(([^\)]*)\)/g, function(matcher, desc, img) {
            return '!['+desc+']('+baseUrl+img+')';
        });
        return t;
    });


}(window.App = window.App || {}, jQuery));

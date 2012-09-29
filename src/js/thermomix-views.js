(function (App, $, _, undefined) {
    "use strict";

    App.categories.render = function(placeholder) {
        var withCount = _.map(App.data.categories, function(c) { 
            c.count = _.filter(App.data.recipes, function(r) {
                return r.categoryId === c.id;
            }).length;
            return c; 
        });
        var categories = App.categories.tpl({ 'categories': withCount });
        $(placeholder).html(categories);
    }

    App.recipes.render = function(placeholder, categoryId) {
        var recipesForCategory = _.filter(App.data.recipes, function(r) { return r.categoryId == categoryId; });
        var recipes = App.recipes.tpl({ 'recipes': recipesForCategory });
        $(placeholder).html(recipes).listview();

    }
    
}(window.App = window.App || {}, jQuery, _));

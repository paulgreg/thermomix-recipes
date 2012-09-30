(function (App, $, _, undefined) {
    "use strict";

    App.categories.render = function(placeholder) {
        var withCount = _.map(App.data.categories, function(c) { 
            c.count = _.filter(App.data.recipes, function(r) {
                return r.categoryId === c.id;
            }).length;
            return c; 
        });
        var categoriesHtml = App.categories.tpl({ 'categories': withCount });
        $(placeholder).html(categoriesHtml).listview('refresh');
    }

    App.recipes.render = function(placeholder, categoryId) {
        var recipesForCategory = _.filter(App.data.recipes, function(r) { return r.categoryId === parseInt(categoryId, 10); });
        var recipesHtml = App.recipes.tpl({ 'recipes': recipesForCategory, 'categoryId': categoryId });
        $(placeholder).html(recipesHtml).listview('refresh');
    }
    
    App.recipe.render = function(placeholder, recipeId, categoryId) {
        var recipe = _.find(App.data.recipes, function(r) { return r.id === parseInt(recipeId, 10) });
        var $placeholder = $(placeholder);
        $placeholder.find('h1').html(recipe.name);
        $placeholder.find('.content').html(recipe.recipe);
    }

}(window.App = window.App || {}, jQuery, _));

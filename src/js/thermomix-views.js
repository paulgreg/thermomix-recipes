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
        var recipesForCategory = _.filter(App.data.recipes, function(r) { return r.categoryId === parseInt(categoryId, 10); });
        var previousRecipe = getPrevious(recipesForCategory, parseInt(recipeId, 10));
        var nextRecipe = getNext(recipesForCategory, parseInt(recipeId, 10));

        var $placeholder = $(placeholder);
        $placeholder.find('h1').html(recipe.name);
        $placeholder.find('.content').html(recipe.recipe);
        if (previousRecipe) {
            $placeholder.find('.previous')
                .attr('href', '#recipe?categoryId='+categoryId+'&recipeId='+previousRecipe.id)
                .click(_.bind(App.recipe.render, this, placeholder, previousRecipe.id, categoryId))
                .show();
        } else {
            $placeholder.find('.previous').unbind('click').hide();
        }
        if (nextRecipe) {
            $placeholder.find('.next')
                .attr('href', '#recipe?categoryId='+categoryId+'&recipeId='+nextRecipe.id)
                .click(_.bind(App.recipe.render, this, placeholder, nextRecipe.id, categoryId))
                .show();
        } else {
            $placeholder.find('.next').unbind('click').hide();
        }
    }
    var getPrevious = function(elements, id) {
        var idx = getIndex(elements, id);
        return (idx > 0) ? elements[idx-1] : null;
    };
    var getNext = function(elements, id) {
        var idx = getIndex(elements, id);
        return (idx < elements.length) ? elements[idx+1] : null;
    };
    var getIndex = function(elements, id) {
        for(var i = 0; i < elements.length; i++) {
            if (elements[i].id === id) {
                return i;
            }
        }
        return -1;
    }

}(window.App = window.App || {}, jQuery, _));

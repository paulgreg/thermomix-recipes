(function (App, $, _, undefined) {
    "use strict";

    var converter = Markdown.getSanitizingConverter(); 

    var getSortedCategoriesWithCount = function() {
        var sortedCategories = _.sortBy(App.data.categories, function(c) { return c.name; });
        var sortedCategoriesWithCount = _.map(sortedCategories, function(c) { 
            c.count = _.filter(App.data.recipes, function(r) {
                return r.categoryId === c.id;
            }).length;
            return c; 
        });
        return sortedCategoriesWithCount;
    };

    var getSortedRecipesForCategories = function(categoryId) {
        var sortedRecipes = _.sortBy(App.data.recipes, function(r) { return r.name; });
        var recipesForCategory = _.filter(sortedRecipes, function(r) { return r.categoryId === parseInt(categoryId, 10); });
        return recipesForCategory;
    };

    App.categories.render = function(placeholder) {
        var categoriesHtml = App.categories.tpl({ 'categories': getSortedCategoriesWithCount() });
        $(placeholder).html(categoriesHtml).listview('refresh');
    }

    App.categories.renderSelect = function(placeholder) {
        var sortedCategories = _.sortBy(App.data.categories, function(c) { return c.name; });
        $(placeholder).html(App.categories.selectTpl({'categories': sortedCategories}));
    };

    App.categories.renderEdit = function(placeholder) {
        var categoriesHtml = App.categories.editTpl({ 'categories': getSortedCategoriesWithCount() });
        $(placeholder).html(categoriesHtml).listview('refresh');
    }

    App.recipes.render = function(placeholder, categoryId) {
        var recipesForCategory = getSortedRecipesForCategories(categoryId);
        var recipesHtml = App.recipes.tpl({ 'recipes': recipesForCategory, 'categoryId': categoryId });
        $(placeholder).html(recipesHtml).listview('refresh');
    }
    
    App.recipe.render = function(placeholder, recipeId, categoryId) {
        var recipe = _.find(App.data.recipes, function(r) { return r.id === parseInt(recipeId, 10) });
        var recipesForCategory = getSortedRecipesForCategories(categoryId);
        var previousRecipe = getPrevious(recipesForCategory, parseInt(recipeId, 10));
        var nextRecipe = getNext(recipesForCategory, parseInt(recipeId, 10));

        var $placeholder = $(placeholder);
        $placeholder.find('h1').html(recipe.name);
        $placeholder.find('.content').html(converter.makeHtml(recipe.recipe));
        var $editLink = $placeholder.find('a.edit').clone();
        $editLink.attr('href', $editLink.attr('href') + recipe.id);
        $placeholder.find('.content').append($editLink);

        (previousRecipe) ?
            $placeholder.find('.previous')
                .attr('href', '#recipe?categoryId='+categoryId+'&recipeId='+previousRecipe.id)
                .click(_.bind(App.recipe.render, this, placeholder, previousRecipe.id, categoryId))
                .show() :
            $placeholder.find('.previous').unbind('click').hide();

        (nextRecipe) ?
            $placeholder.find('.next')
                .attr('href', '#recipe?categoryId='+categoryId+'&recipeId='+nextRecipe.id)
                .click(_.bind(App.recipe.render, this, placeholder, nextRecipe.id, categoryId))
                .show() :
            $placeholder.find('.next').unbind('click').hide();
    };

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

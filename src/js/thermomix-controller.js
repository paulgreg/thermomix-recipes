(function (App, $, undefined) {
    "use strict";

    // --------------- 
    // Categories page
    // --------------- 
    $('#categories').live('pagecreate',function(event) {
        App.categories.tpl = _.template($('#categories-list-template').text());
    });
    $('#categories').live('pagebeforeshow',function(event) {
        App.categories.render('#categories-list');
    });

    // --------------- 
    // Recipes page
    // --------------- 
    $('#recipes').live('pagecreate',function(event) {
        App.recipes.tpl = _.template($('#recipes-list-template').text());
    });
    $('#recipes').live('pagebeforeshow',function(event) {
        App.recipes.render('#recipes-list', $.mobile.pageData.categoryId);
        var category = _.find(App.data.categories, function(c) { return c.id === parseInt($.mobile.pageData.categoryId, 10) });
        $('#recipes h1').html(category.name);
    });

    // --------------- 
    // Recipe page
    // --------------- 
    $('#recipe').live('pagebeforeshow',function(event) {
        App.recipe.render('#recipe', $.mobile.pageData.recipeId, $.mobile.pageData.categoryId);
    });

    // --------------- 
    // Add recipe page
    // --------------- 
    $('#add-recipe').live('pagecreate',function(event) {
        App.categories.selectTpl = _.template($('#categories-select-list-template').text());

        $('#add-recipe .cancel').click(function(e) {
            return confirm('Annuler la saisie ?');
        });
        $('#add-recipe .save').click(function(e) {
            var newId = _.max(_.pluck(App.data.recipes, 'id'))+1;
            var newRecipe = {
                'id': newId,
                'name': $('#add-recipe [name=name]').val(),
                'categoryId': parseInt($('#add-recipe [name=category]').val(), 10),
                'recipe': $('#add-recipe [name=recipe]').val()
            };
            App.data.recipes.push(newRecipe);
            $('#add-recipe form').get(0).reset();
        });

    });
    $('#add-recipe').live('pagebeforeshow',function(event) {
        App.categories.renderSelect('#add-recipe [name=category]');
        $('#add-recipe [name=category] option').first().attr('selected', 'selected'); // Select first entry
        $('#add-recipe [name=category]').selectmenu('refresh');
    });

    // jQuery mobile parameter plugin
    $(document).bind("pagebeforechange", function(event, data) {
        $.mobile.pageData = (data && data.options && data.options.pageData) ? data.options.pageData : null;
    });


}(window.App = window.App || {}, jQuery));

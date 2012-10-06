(function (App, $, undefined) {
    "use strict";

    // -------------------------- 
    // jQuery mobile parameter plugin
    // -------------------------- 
    $(document).bind("pagebeforechange", function(event, data) {
        $.mobile.pageData = (data && data.options && data.options.pageData) ? data.options.pageData : null;
    });

    // -------------------------- 
    // Categories page (Homepage)
    // -------------------------- 
    $('#categories').live('pagecreate',function(event) {
        App.categories.tpl = _.template($('#categories-list-template').text());
    });
    $('#categories').live('pagebeforeshow',function(event) {
        App.categories.render('#categories-list');
    });

    // -------------------------- 
    // Recipes page
    // -------------------------- 
    $('#recipes').live('pagecreate',function(event) {
        App.recipes.tpl = _.template($('#recipes-list-template').text());
    });
    $('#recipes').live('pagebeforeshow',function(event) {
        App.recipes.render('#recipes-list', $.mobile.pageData.categoryId);
        var category = _.find(App.data.categories, function(c) { return c.id === parseInt($.mobile.pageData.categoryId, 10) });
        $('#recipes h1').html(category.name);
    });

    // -------------------------- 
    // Recipe page
    // -------------------------- 
    $('#recipe').live('pagebeforeshow',function(event) {
        App.recipe.render('#recipe', $.mobile.pageData.recipeId, $.mobile.pageData.categoryId);
    });

    // -------------------------- 
    // Edit recipe page
    // -------------------------- 
    $('#edit-recipe').live('pagecreate',function(event) {
        App.categories.selectTpl = _.template($('#categories-select-list-template').text());

        $('#edit-recipe .cancel').click(function(e) {
            return confirm('Annuler la saisie ?');
        });
        $('#edit-recipe .save').click(function(e) {
            var name = $('#edit-recipe [name=name]').val();
            var recipe = $('#edit-recipe [name=recipe]').val();
            if (name === "" || recipe === "") {
                alert('Veuillez renseigner le nom ou la description.');
                return false;
            }
                
            var newId = (App.data.recipes.length > 0) ? _.max(_.pluck(App.data.recipes, 'id'))+1 : 1;
            var newRecipe = {
                'id': newId,
                'name': name,
                'categoryId': parseInt($('#edit-recipe [name=category]').val(), 10),
                'recipe': recipe
            };
            App.data.recipes.push(newRecipe);
            $('#edit-recipe form').get(0).reset();

            App.saveData();
        });

    });
    $('#edit-recipe').live('pagebeforeshow',function(event) {
        App.categories.renderSelect('#edit-recipe [name=category]');
        $('#edit-recipe [name=category] option').first().attr('selected', 'selected'); // Select first entry
        $('#edit-recipe [name=category]').selectmenu('refresh');
    });

    // -------------------------- 
    // Configuration page
    // -------------------------- 
    $('#configuration').live('pagecreate',function(event) {

        App.categories.editTpl = _.template($('#categories-edit-list-template').text());

        $('#configuration .cancel').click(function(e) {
            return confirm('Annuler ?');
        });
        $('#configuration .save').click(function(e) {
            var cookbook = $('#configuration-cookbook').val();
            if (cookbook === "") {
                alert('Veuillez renseigner le nom du livre de recette.');
                return false;
            }
            if (cookbook !== App.configuration.cookbook) {
                App.switchCookbook(cookbook);
            }
        });
    });
    $('#configuration').live('pagebeforeshow',function(event) {
        App.categories.renderEdit('#categories-edit-list');
        $('#configuration-cookbook').val(App.configuration.cookbook);
    });

    // -------------------------- 
    // Edit category page
    // -------------------------- 
    $('#edit-category').live('pagecreate',function(event) {
        $('#edit-category .cancel').click(function(e) {
            return confirm('Annuler la saisie ?');
        });
        $('#edit-category .save').click(function(e) {
            var name = $('#edit-category [name=name]').val();
            if (name === "") {
                alert('Veuillez renseigner le nom.');
                return false;
            }

            var categoryId = $.mobile.pageData && $.mobile.pageData.categoryId ? parseInt($.mobile.pageData.categoryId, 10) : undefined;
            if (categoryId === undefined) {
                var newId = (App.data.categories.length > 0) ? _.max(_.pluck(App.data.categories, 'id'))+1 : 1;
                var newCategory = {
                    'id': newId,
                    'name': name
                };
                App.data.categories.push(newCategory);
            } else {
                var category = _.find(App.data.categories, function(c) { return c.id === categoryId; });
                category.name = name;
            }

            App.saveData();
            $('#edit-category form').get(0).reset();
        });

    });
    $('#edit-category').live('pagebeforeshow',function(event) {
        var edit = false;
        if ($.mobile.pageData !== null) {
            var categoryId = parseInt($.mobile.pageData.categoryId, 10);
            var category = _.find(App.data.categories, function(c) { return c.id === categoryId; });
            if (category !== undefined) $('#edit-category [name=name]').val(category.name);
            edit = true;
        }
        $('#edit-category h1.edit')[(edit) ? 'show' : 'hide']();
        $('#edit-category h1.new')[(edit) ? 'hide' : 'show']();
    });

}(window.App = window.App || {}, jQuery));

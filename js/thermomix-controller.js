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
        var $addLink = $('#recipes a[data-icon=add]');
        $addLink.attr('href', $addLink.data('href').replace('%categoryId%', category.id));
    });

    // -------------------------- 
    // Recipes by last done page
    // -------------------------- 
    $('#recipes-last-done').live('pagecreate',function(event) {
        App.recipes.tplLastDone = _.template($('#recipes-last-done-list-template').text());
    });
    $('#recipes-last-done').live('pagebeforeshow',function(event) {
        App.recipes.renderByLastDone('#recipes-last-done-list');
    });

    // -------------------------- 
    // Recipe page
    // -------------------------- 
    $('#recipe').live('pagebeforeshow',function(event) {
        App.recipe.render('#recipe', $.mobile.pageData.recipeId, $.mobile.pageData.categoryId);

        var recipeId = parseInt($.mobile.pageData.recipeId, 10);

        $('#recipe .content a.done').click(function() {
            var currentRecipe = _.find(App.data.recipes, function(c) { return c.id === recipeId; });
            currentRecipe.lastDone = (new Date()).getTime();
            App.saveData();
            return false;
        });
        $('#recipe .content a.delete').click(function() {
            var confirmation = confirm('Supprimer cette recette ?');
            if (confirmation) {
                App.data.recipes = _.filter(App.data.recipes, function(r) {
                    return r.id !== recipeId;
                });
                App.saveData();
            }
            return confirmation;
        });
    });

    // -------------------------- 
    // Edit recipe page
    // -------------------------- 
    var refreshMarkDown = function() {
        $('#edit-recipe p.output').html(App.converter.makeHtml($('#edit-recipe [name=recipe]').val()));
    };
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

            var categoryId = parseInt($('#edit-recipe [name=category]').val(), 10);
            var recipeId = $.mobile.pageData && $.mobile.pageData.recipeId ? parseInt($.mobile.pageData.recipeId, 10) : undefined;
            if (recipeId === undefined) {
                recipeId = (App.data.recipes.length > 0) ? _.max(_.pluck(App.data.recipes, 'id'))+1 : 1;
                var newRecipe = {
                    'id': recipeId,
                    'name': name,
                    'categoryId': categoryId,
                    'recipe': recipe
                };
                App.data.recipes.push(newRecipe);
            } else {
                var currentRecipe = _.find(App.data.recipes, function(c) { return c.id === recipeId; });
                currentRecipe.name = name;
                currentRecipe.categoryId = categoryId;
                currentRecipe.recipe = recipe;
            }

            $(this).attr('href', $(this).data('href').replace('%categoryId%', categoryId).replace('%recipeId%', recipeId));
            App.saveData();
        });

        $('#edit-recipe .insert').click(function() {
            var t = $('#edit-recipe [name=recipe]').get(0);
            var v = '!['+$(this).attr('title')+']('+$(this).attr('src')+')';
            (t.selectionStart !== 0) ?
                t.value = t.value.substring(0, t.selectionStart) + v + t.value.substring(t.selectionEnd, t.value.length) : 
                t.value += v;
            refreshMarkDown();
            t.selectionStart += v.length;
            t.focus();
            return false;
        });
    });
    $('#edit-recipe').live('pagebeforeshow',function(event) {
        App.categories.renderSelect('#edit-recipe [name=category]');
        var edit = $.mobile.pageData !== null && $.mobile.pageData.recipeId;
        if (edit) {
            var recipeId = parseInt($.mobile.pageData.recipeId, 10);
            var recipe = _.find(App.data.recipes, function(c) { return c.id === recipeId; });
            $('#edit-recipe [name=name]').val(recipe.name);
            $('#edit-recipe [name=category]').val(recipe.categoryId);
            $('#edit-recipe [name=recipe]').val(recipe.recipe);
        } else {
            $('#edit-recipe [name=name]').val("");
            var preselectedCategoryId = $.mobile.pageData !== null && $.mobile.pageData.categoryId;
            if (preselectedCategoryId) {
                $('#edit-recipe [name=category]').val(preselectedCategoryId);
            } else {
                $('#edit-recipe [name=category] option').first().attr('selected', 'selected');
            }
            $('#edit-recipe [name=recipe]').val("");
        }
        $('#edit-recipe [name=category]').selectmenu('refresh');
        $('#edit-recipe h1.edit')[(edit) ? 'show' : 'hide']();
        $('#edit-recipe h1.new')[(edit) ? 'hide' : 'show']();

        refreshMarkDown(); // At startup
        $('#edit-recipe [name=recipe]').on('keyup', refreshMarkDown);
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
                var currentCategory = _.find(App.data.categories, function(c) { return c.id === categoryId; });
                currentCategory.name = name;
            }
            App.saveData();
        });

        $('#edit-category .delete').click(function(e) {
            var confirmation = confirm('Supprimer cette catégorie ?');
            if (confirmation) {
                var categoryId = parseInt($.mobile.pageData.categoryId, 10);
                App.data.categories = _.filter(App.data.categories, function(c) {
                    return c.id !== categoryId;
                });
                App.saveData();
            }
            return confirmation;
        });
    });
    $('#edit-category').live('pagebeforeshow',function(event) {
        var edit = $.mobile.pageData !== null;
        var categoryId = undefined;
        if (edit) {
            categoryId = parseInt($.mobile.pageData.categoryId, 10);
            var category = _.find(App.data.categories, function(c) { return c.id === categoryId; });
            $('#edit-category [name=name]').val(category.name);
        } else {
            $('#edit-category [name=name]').val("");
        }
        $('#edit-category h1.edit')[(edit) ? 'show' : 'hide']();
        $('#edit-category h1.new')[(edit) ? 'hide' : 'show']();

        var showDeleteButton = false;
        if (categoryId !== undefined) { 
            var count = _.filter(App.data.recipes, function(r) {
                return r.categoryId === categoryId;
            }).length;
            showDeleteButton = count === 0;
        }
        $('#edit-category a.delete')[(showDeleteButton === true) ? 'show' : 'hide']();
    });

}(window.App = window.App || {}, jQuery));

(function (App, $, undefined) {
    "use strict";

    // jQuery mobile parameter plugin
    $(document).bind("pagebeforechange", function(event, data) {
        $.mobile.pageData = (data && data.options && data.options.pageData) ? data.options.pageData : null;
    });

    // --------------- 
    // Categories page
    // --------------- 
    $('#categories').live('pagecreate',function(event) {
        App.categories.tpl = _.template($('#categories-list-template').text());
    });
    $('#categories').live('pagebeforeshow',function(event) {
        App.categories.render('#categories-list');
        $("#categories-list").listview("refresh");
    });

    // --------------- 
    // Recipes page
    // --------------- 
    $('#recipes').live('pagecreate',function(event) {
        App.recipes.tpl = _.template($('#recipes-list-template').text());
    });
    $('#recipes').live('pagebeforeshow',function(event) {
        App.recipes.render('#recipes-list', $.mobile.pageData.category);
        $("#recipes-list").listview("refresh");
    });

}(window.App = window.App || {}, jQuery));

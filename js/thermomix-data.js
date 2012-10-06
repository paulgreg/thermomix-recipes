(function (App, $, undefined) {
    "use strict";
    
    App.data = window.localStorage.data || {};
    App.configuration = {
        'datastoreUrl': 'datastore.php?n=',
        'cookbook': window.localStorage.cookbook || 'default'
    };

    App.loadData = function() {
        $.ajax({
            url: App.configuration.datastoreUrl + App.configuration.cookbook, 
            dataType: 'json',
            async: false, // Do not use Ajax since data are mandatory
            success: function onSuccess(data) {
                App.data = data;
                window.localStorage.data = App.data; // refresh localStorage
            },
            error: function onError(xhr) {
                console.error('App.loadData', xhr);
                if (xhr.status === 404) {
                    // Cookbook doesn’t exist, try to create one 
                    App.data = {categories: [{"id":1,"name":"default"}], recipes: []};
                    App.saveData();
                }
            }
        });
    };

    App.saveData = function() {
        $.ajax({
            type: 'POST',
            url: App.configuration.datastoreUrl + App.configuration.cookbook, 
            async: false, // Do not use Ajax since data are mandatory
            data: { v: JSON.stringify(App.data) },
            success: function onSuccess(data) {
                console.info('App.saveData', data);
                window.localStorage.data = App.data; // refresh localStorage
            },
            error: function onError(data) {
                console.error('App.saveData', data);
                alert('failed to save data on server');
            }
        });
    };

    App.switchCookbook = function(newCookbook) {
        App.saveData();
        App.configuration.cookbook = newCookbook;
        window.localStorage.cookbook = newCookbook;
        App.loadData();
    }

    // Load data at startup if browser is connected
    if (navigator.onLine) App.loadData();

}(window.App= window.App || {}, jQuery));


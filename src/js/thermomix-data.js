(function (App, $, undefined) {
    "use strict";

    { // if ?cookbook=name is set, load that cookbook
        var g = /[^?]*cookbook=([a-zA-Z0-9]*)/.exec(window.location.search);
        if (g && g.length === 2) {
            window.localStorage.cookbook = g[1];
            window.location.search = ''; // Cleanup the querystring to avoid side effects ; that will also reload the page
        }
    }
    
    App.configuration = {
        'datastoreUrl': '/json-store/thermomixrecipes/',
        'cookbook': window.localStorage.cookbook || 'default'
    };
    App.data = window.localStorage.recipes !== undefined ? JSON.parse(window.localStorage.recipes) : {};

    var load = function(onSuccess, onError) {
        $.ajax({
            url: App.configuration.datastoreUrl + App.configuration.cookbook + '.json', 
            dataType: 'json',
            async: false, // Do not use Ajax since data are mandatory
            success: onSuccess,
            error: onError
        });
    };

    var save = function() {
        $.ajax({
            type: 'POST',
            url: App.configuration.datastoreUrl + App.configuration.cookbook + '.json', 
            async: false, // Do not use Ajax since data are mandatory
            data: JSON.stringify(App.data),
            contentType:"application/json; charset=utf-8",
            datatype: 'json',
            success: function onSuccess(data) {
                console.info('App.saveData', data);
                window.localStorage.recipes = JSON.stringify(App.data); // refresh localStorage
            },
            error: function onError(data) {
                console.error('App.saveData on save', data);
                alert(document.webL10n.get('error-on-save'));
            }
        });
    };

    App.loadData = function() {
        load(function onSuccess(data) {
            App.data = data;
            window.localStorage.recipes = JSON.stringify(App.data); // refresh localStorage
        }, function onError(xhr) {
            console.error('App.loadData', xhr);
            if (xhr.status === 404) {
                // Cookbook doesn’t exist, try to create one 
                App.data = {"categories": [{"id":1,"name":"default"}], "recipes": [], "lastSave": (new Date()).getTime() };
                save();
            }
        });
    };

    App.saveData = function() {
        load(function onSuccess(dataOnServer) {
            var shouldSave;
            // Basic timestamp check to avoid overiding data
            if (dataOnServer.lastSave === undefined || parseInt(dataOnServer.lastSave, 10) === App.data.lastSave) { 
                shouldSave = true;
            } else {
                shouldSave = confirm(document.webL10n.get('error-old-data'));
            }
            if (shouldSave === true) {
                App.data.lastSave = (new Date()).getTime();
                save();
            }
        }, function onError(xhr) {
            console.error('App.saveData on load to check timestamp', xhr);
            if (xhr.status === 404) {
                App.data.lastSave = (new Date()).getTime();
                save();
            } else {
                alert(document.webL10n.get('error-on-save'));
            }
        });
    };

    App.switchCookbook = function(newCookbook) {
        App.configuration.cookbook = newCookbook;
        window.localStorage.cookbook = newCookbook;
        App.loadData();
    };

    // Load data at startup if browser is connected
    if (navigator.onLine && window.ThermomixRecipesUnderTest !== true) {
        App.loadData();
    }

}(window.App= window.App || {}, jQuery));


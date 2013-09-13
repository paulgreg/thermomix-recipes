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
        'datastoreUrl': 'datastore.php?n=',
        'cookbook': window.localStorage.cookbook || 'default'
    };
    App.data = window.localStorage.data !== undefined ? JSON.parse(window.localStorage.data) : {};

    var load = function(onSuccess, onError) {
        $.ajax({
            url: App.configuration.datastoreUrl + App.configuration.cookbook, 
            dataType: 'json',
            async: false, // Do not use Ajax since data are mandatory
            success: onSuccess,
            error: onError
        });
    };

    var save = function() {
        $.ajax({
            type: 'POST',
            url: App.configuration.datastoreUrl + App.configuration.cookbook, 
            async: false, // Do not use Ajax since data are mandatory
            data: { v: JSON.stringify(App.data) },
            datatype: 'text',
            success: function onSuccess(data) {
                console.info('App.saveData', data);
                window.localStorage.data = JSON.stringify(App.data); // refresh localStorage
            },
            error: function onError(data) {
                console.error('App.saveData on save', data);
                alert('Erreur lors de la sauvegarde');
            }
        });
    };

    App.loadData = function() {
        load(function onSuccess(data) {
            App.data = data;
            window.localStorage.data = JSON.stringify(App.data); // refresh localStorage
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
                shouldSave = confirm('Les donnés sur le serveur semblent plus récentes que celles chargées dans l’application. Vous pouvez forcer la sauvegarde mais cela risque d’écraser des données sur le serveur. Dans le doute, cliquez sur annuler et rafraîchissez la page.');
            }
            if (shouldSave === true) {
                App.data.lastSave = (new Date()).getTime();
                save();
            }
        }, function onError() {
            console.error('App.saveData on load to check timestamp', xhr);
            alert('Erreur lors de la sauvegarde');
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


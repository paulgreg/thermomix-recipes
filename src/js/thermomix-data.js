(function (App, $, undefined) {
    "use strict";
    
    App.data = {
        categories: [
            { id: 1, name: 'entrées' },
            { id: 2, name: 'plats' },
            { id: 3, name: 'desserts' }
        ],
        recipes: [
            { id: 1, name: 'oeufs brouillés', categoryId: 1, recipe: 'cuire les oeufs' },
            { id: 2, name: 'tiramisu', categoryId: 3, recipe: 'Mettre du mascarpone' },
            { id: 3, name: 'Baba au rhum', categoryId: 3, recipe: 'Imbiber le baba' }
        ]
    };

}(window.App= window.App || {}, jQuery));


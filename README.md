# Thermomix-recipes

- That application is a basic cookbook based on jQuery mobile (dedicated for a kitchen robot my wife bought called 'thermomix').
- Application is mainly written in JavaScript, on the client side.
- Data (categories, recipes and cookbook name) are stored in the client’s localStorage.
- Data (localStorage exported in JSON) are persisted on the server using [json-store project](https://github.com/paulgreg/json-store)
- You can switch between cookbooks, which are stored on separated files on the server.
- Application should work on offline mode, in a read only mode (using a ServiceWorker).

### Demo

Here’s a read only demo version of the application : http://thermomix.recipes.free.fr

### Hosting pre-requisites

You‘ll need to host [json-store](https://github.com/paulgreg/json-store) on same server and create a directory `thermomix-recipes` in it’s data directory.

You’ll also need to copy `src/js/settings.js.dist` to `src/js/settings.js` and update secret in it. The secret is the one you’ve defined in json-store (you’ll need to set the base64 encoded string displayed at json-store startup).

If you want to keep previous behavior (store directly from same projet), you can use branch `with-php-store`. You’ll need then PHP support on server.

## Build

node 8 is needed to run grunt.
node 10+ is not compatible.

Run "rake".

The build process :

- copies files,
- concats and minifies JavaScript,
- appends git last commit hash to html file.

### Prerequisites

To build the application, you’ll need rake and grunt (which depends on nodejs).
For developpement, you’ll need to activate Apache’s rewrite mod (see src/.htaccess file) if you’re using apache.

## Installation

1. Once the build process ran, Copy all "dist" files on the server,
2. set write attributes to the data folder for the web server’s user.

## Know issues

- Application labels and messages are written in french.
- For now, all data (meaning all categories and all recipes) are sent on the server on each save (yeah I know, not really bandwith efficient).
- Concurrency check is very very basic for now (on save, we compare a timestamp between local data and server data and ask user if he want to override all data or not).

## Legal stuff

This application uses following OpenSource code or images :
- Underscore (http://underscorejs.org/),
- jQuery (http://jquery.com/),
- jQuery Mobile (http://jquerymobile.com/),
- jQuery mobile page param plugin (https://github.com/jblas/jquery-mobile-plugins/tree/master/page-params),
- webL10n library for localization (https://github.com/fabi1cazenave/webL10n/),
- qUnit (http://qunitjs.com),
- PageDown editor (https://code.google.com/p/pagedown/),
- FamFamFam icons (http://www.famfamfam.com/),
- Grunt for JavaScript build (http://gruntjs.com/).

I also used some icons from the Thermomix manual and derived the logo for the icon.

# Thermomix-recipes

- That application is a basic cookbook based on jQuery mobile (dedicated for a kitchen robot my wife bought called 'thermomix').
- Application is mainly written in JavaScript, on the client side.
- Data (categories, recipes and cookbook name) are stored in the client’s localStorage.
- Data (localStorage exported in JSON) are persisted on the server using a small piece of code in PHP.
- You can switch between cookbooks, which are stored on separated files on the server.
- Application should work on offline mode, in a read only mode.

### Prerequisites

You’ll need PHP5 on the server to run the app.

## Build

Run "rake".

The build process copy files, concat and minify JavaScript, appends git last commit hash to html file and generate the appcache.manifest for offline use.

### Prerequisites

To build the application, you’ll need rake and grunt (which uses nodejs).
For developpement, you’ll need to active Apache’s rewrite mod (see src/.htaccess file).

## Installation

1. Copy files on the server,
2. set write attributes to the data folder for the web server’s user.

## Know issues

- Application labels and messages are written in french.
- For now, all data (meaning all categories and all recipes) are sent on the server on each save (yeah I know, not really bandwith efficient for now).
- Concurrency check is very very basic for now (on save, we compare a timestamp between local data and server data and ask user if he want to override all data or not).

## Legal stuff

Code of that application is released under GPLv2 : http://opensource.org/licenses/GPL-2.0

This application uses following OpenSource code or images : 
- Underscore (http://underscorejs.org/), 
- jQuery (http://jquery.com/), 
- jQuery Mobile (http://jquerymobile.com/), 
- jQuery mobile page param plugin (https://github.com/jblas/jquery-mobile-plugins/tree/master/page-params),
- qUnit (http://qunitjs.com),
- PageDown editor (https://code.google.com/p/pagedown/),
- FamFamFam icons (http://www.famfamfam.com/),
- Grunt for JavaScript build.

I also used some icons from the Thermomix manual and derived the logo for the icon.

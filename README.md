# Thermomix-recipes

- That application is a basic cookbook based on jQuery mobile (dedicated for a kitchen robot my wife bought called 'thermomix').
- Application is mainly written in JavaScript, on the client side.
- Data (categories, recipes and cookbook name) are stored in the client’s localStorage.
- Data (localStorage exported in JSON) are persisted on the server using a small piece of code in PHP (because it’s far easier to host on my old power-pc server).
- You can switch between cookbooks, which are stored on separated files on the server.
- Application should work on offline mode, in a read only mode.

## Installation

1. Copy files on the server,
2. set write attributes to the data folder for the web server,
3. run scripts/build\_manifest.py in order to build the manifest file for offline use (that should be done for each new version, to refresh manifest timestamp).

## Know issues

- Application labels and messages are written in french.
- For now, all data (meaning all categories and all recipes) are sent on the server on each save (yeah I know, not really bandwith efficient for now).
- Concurrency check is very very basic for now (on save, we compare a timestamp between local data and server data and ask user if he want to override all data or not).

CouchDB would address thoses issues but, as I said, I have problem running it on my power-pc server.

## Legal stuff

Code of that application is released under GPLv2 : http://opensource.org/licenses/GPL-2.0

This application uses following OpenSource code or images : 
- Underscore (http://underscorejs.org/), 
- jQuery (http://jquery.com/), 
- jQuery Mobile (http://jquerymobile.com/), 
- jQuery mobile page param plugin (https://github.com/jblas/jquery-mobile-plugins/tree/master/page-params),
- qUnit (http://qunitjs.com),
- PageDown editor (https://code.google.com/p/pagedown/),
- FamFamFam icons (http://www.famfamfam.com/).

I also used some icons from Thermomix manual and derived the logo for the icon.

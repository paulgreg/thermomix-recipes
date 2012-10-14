# Thermomix-recipes

- That application is a basic cookbook based on jQuery mobile (dedicated for a kitchen robot my wife bought called 'thermomix').
- Application is mainly written in JavaScript, on the client side.
- Data (categories, recipes and cookbook name) are stored in the client’s localStorage.
- Data (localStorage exported in JSON) are persisted on the server using a small piece of code in PHP (because it’s far easier to host on my old power-pc server)
- You can switch between cookbooks, which are stored on separated files on the server.
- Application should work on offline mode, in a read only mode.

## Installation

Copy files on the server, run scripts/build_manifest.py in order to build the manifest file for offline use (that should be done for each new version).

## Know issues

- For now, all data (meaning all categories and all recipes) are sent on the server on each save (yeah I know, not really bandwith efficient for now).
- Concurrency check is very very basic for now (on save, we compare a timestamp between local data and server data and ask user if he want to override all data or not).

CouchDB would address thoses issues but, as I said, I have problem running it on my power-pc server.

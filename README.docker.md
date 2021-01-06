# Run via docker

First, build project, see README.md.

Then, give write access to `dist/data` so php can write files in that directory :

    chmod -R 777 dist/data


Then run docker-compose :

    docker-compose up --force-recreate


You can then access thermomix-recipes on http://localhost:8000
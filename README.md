# Commonplace

Commonplace is a bare-bones CMS written with React and Flask.

## Development

Make a copy of .env_template, fill in the fields, and save as dev.env.

Modify your [hosts file](https://en.wikipedia.org/wiki/Hosts_(file)) so that dev.commonplace.com routes to 127.0.0.1:

```
127.0.0.1  dev.commonplace.com
```

Then you can use docker to start the project from this directory

```
docker-compose -f docker-compose-dev.yaml up
```

and navigate to [dev.commonplace.com](http://dev.commonplace.com).

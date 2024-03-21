# Commonplace

Commonplace is a bare-bones CMS written with React and Flask. This is a work in progress. See TODO below.

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

To log in locally for development, navigate to [dev.commonplace.com/admin](http://dev.commonplace.com/admin) and enter username Admin and password TestPassword. 

## Deployment

This is a personal project, so deployment details are intentionally left vague. Since it is small, I'm currently spinning it up as a small VM with the Google Compute Engine.

## Quick and Terrible Demo

(Ignore the title numbers, which were randomly generated and don't actually correspond to any particular order.)

https://github.com/Mwindo/commonplace-public/assets/47676832/3a1b44e7-f2c6-47ef-97c3-0b9adb6e69f0


## TODO:

### Code Improvements:

- Refactor backend get_items.
- Convert JS to TypeScript
- Add pytest API tests, ~~which will require adding a db service to the dev docker-compose. Since I'm not using an ORM, I'll also need to make a simple way to map models to tables. (E.g., spinning up the db service should create the relevant tables based on backend models.)~~ this is done but needs improvement
- Add Selenium (or Puppeteer, or whatever) tests, which will require adding a new service to the dev docker-compose.
- Better test coverage in general.
- CSS theming.
- Translate into a Next.js project. (I started with a pure React project first, bootstrapped with the now deprecated Create React App simply for speed since the intention has always been to translate to Next.js as an exercise rather than starting with it from the get-go.)
- Audit for unused libraries.
- More dynamic modal handling.
- Audit for accessibility, which is currenly half-hearted.

### Features:

- ~~Add better content editing features (e.g., ability to easily add link, quote, etc.).~~ It's not beautiful, but I've made some headway here. The user can now use HTML formatting (and a few custom tags) to format text, then click "Preview" to view what the article will look like in a new tab.
- Add autosave and draft features.

### Bugs:

~~- Clicking the header after paginating should refresh the pagination; e.g., paginating right and clicking the header should return the item list to the original state.~~



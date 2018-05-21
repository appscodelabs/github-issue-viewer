# vue-pwa

> A Vue.js project

## Test PWA

1. Build the `dist/` directory:
  - $ npm run build
2. Install `serve` globally by npm or yarn:
  - $ npm install -g serve
  - $ yarn --global add serve # install by yarn 
2. Run the app with `dist/` directory:
  - serve dist/
3. Now, open chrome developer tool (`Cmd + Shift + I`) | `Network` | Check `Offline`. Now reload the page, it should work as Charm!

4. Also go chrome developer tool (`Cmd + Shift + I`) | `Application` | `Service Workers`. Now, you should see that `status` = <id> activated and is running!

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

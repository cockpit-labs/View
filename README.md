# Cockpit Community Edition - View module 

View is the frontend of [Cockpit solution](https://www.cockpitlabs.io).

This project is built with Vue.js.

Installation of [Core API](https://github.com/cockpit-labs/Core) is required before working on View !  

## Demo
See [the docker image](https://github.com/cockpit-labs/CockpitCE)


## Developing

### Project setup
```
yarn install
```

### Run local server

To run site on local server, you need to put Keycloak config file in public directory
```json
// cockptiview-auth.json to put in public directory
{
  "realm": "cockpit-ce",
  "auth-server-url": "https://keycloak.example.com/auth/",
  "ssl-required": "external",
  "resource": "cockpitview",
  "public-client": true,
  "confidential-port": 0
}
```

If needed, update target attribute in `vue.config.js` to match the Core API URL
```js
// default config
devServer: {
  proxy: {
    '^/core/api': {
      target: 'https://cockpitce.example.com',
      ws: true,
      changeOrigin: true
    },
  }
}
```

After that, compile (with hot-reloads) and run local server
```
yarn serve
```

### Other commands
```
# Compiles and minifies for production
yarn build

# Run unit tests
yarn test:unit

# Lints and fixes files
yarn lint
```


# webpack-env-loader-plugin

A plugin that extends `DefinePlugin` to help load configuration based on environment.

## Installation

First, install with npm:

```
npm install webpack-env-loader-plugin --save
```

Add an instance of the plugin to `webpack.config.js`:

```js
const EnvLoaderPlugin = require("webpack-env-loader-plugin");

module.exports = {
  ...
  plugins: [
    new EnvLoaderPlugin(options)
  ]
};
```

## How it works

`EnvLoaderPlugin` will pick up configuration from files with the pattern `config.{env}.json`, or a custom pattern you define, in this order:

1. First, it will look for `config.default.json` (or `config.default.yml`, if you're into that)
2. Next, it will look for `config.{env}.json`, where `{env}` is `process.env.NODE_ENV`

In your javascript files processed by webpack, all configuration values are exposed under a global object (`__CONFIG__` by default):

```js
if (__CONFIG__.FOO) {
  console.log("foo");
}
```

If you want to trigger webpack builds with different environments, just make sure you set `NODE_ENV`:

```
NODE_ENV=production webpack
```


## Options

### env

Default: `process.env.NODE_ENV`

You can use this option to override `process.env.NODE_ENV` if you want to specify it explicitly.

### reactEnv

Default: `false`

Add configuration that will [set React to production mode](https://facebook.github.io/react/downloads.html#npm) if `env` is `"production"`.

### path

Default: `process.cwd()`

This is the path in which to look for config files.

### filePattern

Default: `config.{env}.json`

Pattern to file config files. `{env}` is replaced by whatever `env` is.

### namespace

Default: "__CONFIG__"

Object that prefixes your config variables, so they don't pollute global state. If you are using eslint, make sure you add it to globals.

### loadDefault

Default: `true`

Load `config.default.json` (or whatever your `filePattern` is with `{env}` set to `default`) before loading other configuration files.

### loadLocalOverride

Default: `null`

If you specify a path in this option, the plugin will load the file and override all other configuration EXCEPT `process.env`;

### loadFromProcessEnv (TODO, not yet implemented)

Default: `true`

Override configuration with values from `process.env` if they are found.

### log

Default: `true`

Log progress to console.

# webpack-env-loader-plugin

A plugin that extends `DefinePlugin` to do help load configuration based on environment.

## Basic Usage

```
npm install webpack-env-loader-plugin --save
```

```js
// webpack.config.json

const EnvLoaderPlugin = require("webpack-env-loader-plugin");

module.exports = {
  ...
  plugins: [
    new EnvLoaderPlugin(options)
  ]
};
```

```js
// production.config.json
{
  "FOO": true
}
```

```js
// This is a file processed by webpack

if (__CONFIG__.FOO) {
  console.log("foo");
}
```

```
NODE_ENV=production webpack
```


## Options

### env

Default: `process.env.NODE_ENV`

You can use this option to override `process.env.NODE_ENV` if you want to specify it explicitly.

### path

Default: `process.cwd()`

This is the path in which to look for config files.

### filePattern

Default: `config.{env}.json`

Pattern to file config files. `{env}` is replaced by whatever `env` is.

### namespace

Default: "__CONFIG__"

Object that prefixes your config variables, so they don't pollute global state. If you are using eslint, make sure you add it to globals.

## loadDefault

Default: `true`

Load `config.default.json` (or whatever your `filePattern` is with `{env}` set to `default`) before loading other configuration files.

## loadLocalOverride

Default: `null`

If you specify a path in this option, the plugin will load the file and override all other configuration EXCEPT `process.env`;

## loadFromProcessEnv (TODO, not yet implemented)

Default: `true`

Override configuration with values from `process.env` if they are found.

## reactEnv

Default: `false`

Add configuration that will [set React to production mode](https://facebook.github.io/react/downloads.html#npm) if `env` is `"production"`.

## log

Default: `true`

Log progress to console.

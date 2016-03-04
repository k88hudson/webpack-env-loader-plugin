"use strict";

const DefinePlugin = require("webpack").DefinePlugin;
const yaml = require("yamljs");
const stripJSONComments = require("strip-json-comments");
const colors = require("colors");
const path = require("path");
const fs = require("fs");

const ENV_TOKEN = "{env}";

const DEFAULT_OPTIONS = {
  path: process.cwd(),
  filePattern: `config.${ENV_TOKEN}.json`,
  namespace: "__CONFIG__",
  env: process.env.NODE_ENV,
  loadDefault: true,
  loadLocalOverride: null,
  loadFromProcessEnv: true,
  reactEnv: false,
  log: true
};

class EnvLoaderPlugin extends DefinePlugin {
  constructor(options) {

    options = Object.assign({}, DEFAULT_OPTIONS, options || {});
    // Computed
    options.fileType = options.fileType ||  path.extname(options.filePattern).replace(".", "");

    let values = {};

    const log = {
      info(text) {
        if (options.log) console.log(colors.yellow("EnvLoaderPlugin: " + text));
      },
      error(text) {
        console.log(colors.red("EnvLoaderPlugin: " + text));
      }
    };

    function mergeFileIfExists(name, isFullPath) {
      const filename = isFullPath ? name : path.resolve(options.path, options.filePattern.replace(ENV_TOKEN, name));
      const extname = isFullPath ? path.extname(filename).replace(".", "") : options.fileType;

      let contents;

      function handleError(e) {
        if (e.code === "ENOENT") {
          log.info(`- Tried to load ${path.relative(process.cwd(), filename)} but it was not found.`);
        } else {
          throw e;
        }
      }

      switch(extname) {
        case "json":
          try {
            contents = JSON.parse(stripJSONComments(fs.readFileSync(filename, "utf8")));
          } catch (e) { handleError(e) }
          break;
        case "yml":
          try {
            contents = yaml.load(filename);
          } catch (e) { handleError(e) }
          break;
        default:
          const msg = `${extname} is not a supported file type for configs.`;
          log.error(msg);
          throw new Error(msg);
      }
      if (typeof contents !== 'undefined') {
        log.info(`- found ${path.relative(process.cwd(), filename)}`);
      }
      if (contents) {
        values = Object.assign({}, values, contents);
      }
    }

    log.info("Loading configs...");

    if (options.loadDefault) {
      mergeFileIfExists("default");
    }
    if (options.env) {
      mergeFileIfExists(options.env.toLowerCase());
    }
    if (options.loadLocalOverride) {
      log.info(`Adding override file...`);
      mergeFileIfExists(options.loadLocalOverride, true);
    }

    let config = {};

    Object.keys(values).forEach(key => {
      let value = values[key];
      if (typeof value === "string") {
        value = `"${value}"`;
      }
      config[options.namespace + "." + key] = value;
    });

    if (options.env && options.reactEnv) {
      config["process.env"] = {
        NODE_ENV: `"${options.env.toLowerCase()}"`
      };
    }

    log.info("Creating DefinePlugin...");

    super(config);

    log.info("Done.");
  }
}

module.exports = EnvLoaderPlugin;

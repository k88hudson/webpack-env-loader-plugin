const chai = require("chai");
chai.use(require("chai-fs"));
const assert = chai.assert;
const path = require("path");
const fs = require("fs-extra");

const webpack = require("webpack");
const EnvPlugin = require("../lib/webpack-env-loader-plugin");

const FIXTURES_PATH = path.join(__dirname, "fixtures");
const OUTPUT_PATH = path.join(FIXTURES_PATH, "output");
const OUTPUT_FILENAME = "bundle.js";
const OUTPUT_FILE_PATH = path.join(OUTPUT_PATH, OUTPUT_FILENAME);
const ENTRY_FILE_PATH = path.join(FIXTURES_PATH, "basic.js");

function createConfigFile(name, config) {
  fs.outputJsonSync(path.join(FIXTURES_PATH, name), config);
}

function createSourceFile(text) {
  fs.outputFileSync(ENTRY_FILE_PATH, text);
}

function runWebpack(webpackConfig, config, callback) {
  webpack(Object.assign({
    entry: ENTRY_FILE_PATH,
    output: {
      path: OUTPUT_PATH,
      filename: OUTPUT_FILENAME
    },
    plugins: [new EnvPlugin(config)]
  }, webpackConfig), callback);
}

describe("test", () => {
  beforeEach(() => {
    fs.mkdirsSync(FIXTURES_PATH);
  });
  afterEach(() => {
    fs.removeSync(FIXTURES_PATH);
  });

  it("should load default config", done => {
    createConfigFile("config.default.json", {foo: "default"});
    createSourceFile("console.log(__CONFIG__.foo)");
    const config = {
      path: FIXTURES_PATH,
      log: false
    };
    runWebpack({}, config, function (err) {
      if (err) return done(err);
      assert.fileContentMatch(OUTPUT_FILE_PATH, /console\.log\(\(\"default\"\)\)/);
      done();
    });
  });
  it("should load config file pased on env", done => {
    createConfigFile("config.default.json", {foo: "default"});
    createConfigFile("config.production.json", {foo: "bar"});
    createSourceFile("console.log(__CONFIG__.foo)");

    const config = {
      path: FIXTURES_PATH,
      env: "production",
      log: false
    };
    runWebpack({}, config, function (err) {
      if (err) return done(err);
      assert.fileContentMatch(OUTPUT_FILE_PATH, /console\.log\(\(\"bar\"\)\)/);
      done();
    });
  });
  it("should add react env", done => {
    createSourceFile("console.log(process.env.NODE_ENV)");
    const config = {
      path: FIXTURES_PATH,
      reactEnv: true,
      env: "development",
      log: false
    };
    runWebpack({}, config, function (err, stats) {
      if (err) return done(err);
      assert.fileContentMatch(OUTPUT_FILE_PATH, /console\.log\(\(\"development\"\)\)/);
      done();
    });
  });
});

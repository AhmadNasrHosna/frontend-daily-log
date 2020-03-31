const currentTask = process.env.npm_lifecycle_event;
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const StylelintPlugin = require("stylelint-webpack-plugin");
const fse = require("fs-extra");

const srcDir = "./src/";
const buildDir = "./dist/";

const paths = {
  jsSRC: srcDir + "assets/scripts/App.js",
  jsDIST: "assets/scripts/",
  cssDIST: "assets/styles/",
  imagesSRC: srcDir + "assets/images",
  imagesDIST: buildDir + "assets/images",
  fontsSRC: srcDir + "assets/fonts",
  fontsDIST: buildDir + "assets/fonts"
};

const postCSSPlugins = [
  require("postcss-import"),
  require("postcss-mixins"),
  require("postcss-conditionals"),
  require("postcss-simple-vars"),
  require("postcss-nested"),
  require("postcss-extend"),
  require("postcss-logical")(),
  require("postcss-color-mod-function"),
  require("postcss-preset-env"),
  require("postcss-rem")({
    baseline: 10, // Default to 16
    precision: 3 // Default to 5
  }),
  require("postcss-calc")({
    precision: 3
  })
];

class RunAfterCompile {
  apply(compiler) {
    compiler.hooks.done.tap("Copy Files", () => {
      fse.copySync(paths.imagesSRC, paths.imagesDIST);
      fse.copySync(paths.fontsSRC, paths.fontsDIST);
    });
  }
}

let cssConfig = {
  test: /\.css$/i,
  use: [
    {
      loader: "css-loader",
      options: {
        url: false
      }
    }, //2. Turns css into common js
    {
      loader: "postcss-loader", //1. Turns postCSS into regular css
      options: {
        parser: require("postcss-comment"),
        plugins: postCSSPlugins
      }
    }
  ]
};

let pugConfig = {
  test: /\.pug$/,
  use: ["html-loader?attrs=false", "pug-html-loader"]
};

let pages = fse
  .readdirSync(srcDir)
  .filter((file) => file.endsWith(".pug"))
  .map((page) => {
    // Split names and extension
    const parts = page.split(".");
    const name = parts[0];
    const extension = parts[1];
    return new HtmlWebpackPlugin({
      // Grab HTML files
      filename: `${name}.html`, // Production source
      template: `${srcDir}/${name}.${extension}`, // Development source
      minify: {
        // Minification process
        removeAttributeQuotes: true,
        collapseWhitespace: true,
        removeComments: true
      }
    });
  });

// SHARED: =======================

let config = {
  entry: paths.jsSRC,
  module: {
    rules: [
      cssConfig,
      pugConfig,
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react", "@babel/preset-env"]
          }
        }
      }
    ]
  },
  plugins: pages
};

// DEVELOPMENT Configuration: =======================

if (currentTask == "dev") {
  config.mode = "development";
  config.output = {
    filename: "bundled.js",
    path: path.resolve(__dirname, srcDir)
  };
  cssConfig.use.unshift("style-loader"); //3. Inject styles into DOM
  // Webpack Dev Server
  config.devServer = {
    before: (app, server) => server._watch(srcDir + "**/*.pug"),
    contentBase: path.join(__dirname, srcDir),
    hot: true,
    port: 3000,
    host: "0.0.0.0"
    //open: true
  };
  config.plugins.push(
    new StylelintPlugin({
      configFile: ".stylelintrc.json",
      context: srcDir,
      files: "**/*.css",
      syntax: "scss",
      failOnError: false,
      quiet: false,
      emitErrors: true // by default this is to true to check the CSS lint errors
    })
  );
}

// PRODUCTION Configuration: =======================

if (currentTask == "build") {
  config.mode = "production";
  cssConfig.use.unshift(MiniCSSExtractPlugin.loader); //3. Extract css into files
  postCSSPlugins.push(require("cssnano"));
  config.output = {
    filename: paths.jsDIST + "[name].[chunkhash].js",
    chunkFilename: paths.jsDIST + "[name].[chunkhash].js",
    path: path.resolve(__dirname, buildDir)
  };
  config.optimization = {
    splitChunks: { chunks: "all" }
  };
  config.plugins.push(
    new CleanWebpackPlugin(),
    new MiniCSSExtractPlugin({
      filename: paths.cssDIST + "main.[chunkhash].css"
    }),
    new RunAfterCompile()
  );
}

module.exports = config;

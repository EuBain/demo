const path = require("path");
const webpack = require("webpack");
// 合并配置项插件
const { merge } = require("webpack-merge");
// 插入html插件
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");
// webpack 5+ 使用
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
// webpack 4+ 使用
// const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const srcPath = path.join(__dirname, "src");
const distPath = path.join(__dirname, "dist");

const common = {
  // 单入口
  // entry: path.join(srcPath, "index"),

  // 多入口
  entry: {
    index: path.join(srcPath, "index"),
    other: path.join(srcPath, "other"),
  },
  devtool: false,
  module: {
    rules: [
      // happyPack 多进程打包
      // {
      //     test: /.js$/,
      //     use: 'happypack/loader?id=babel'
      //     exclude: /node_modules/,
      // },
      {
        test: /\.js$/,
        // use: ["babel-loader"],
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              [
                "@babel/plugin-transform-runtime",
                {
                  // absoluteRuntime: false,
                  corejs: 3,
                  // helpers: true,
                  // regenerator: true,
                },
              ],
            ],
          },
        },
        // include: srcPath,
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    //   new HappyPack({
    //       id: 'babel',
    //       loaders: [
    //           {
    //               loader: 'babel-loader',
    //               options: {
    //                   cacheDirectory: true
    //               }
    //           }
    //       ],
    //       // loaders: ['babel-loader'],
    //   })

    // 单入口
    // new HtmlWebpackPlugin({
    //   template: path.join(srcPath, "index.html"),
    //   filename: "index.html",
    // }),

    // 多入口
    new HtmlWebpackPlugin({
      template: path.join(srcPath, "index.html"),
      filename: "index.html",
      // chunks 表示该页面要引用哪些 chunk （即上面的 index 和 other），默认全部引用
      chunks: ["index"], // 只引用 index.js
      // minify:true , // 压缩
    }),
    // 多入口 - 生成 other.html
    new HtmlWebpackPlugin({
      template: path.join(srcPath, "other.html"),
      filename: "other.html",
      chunks: ["other"], // 只引用 other.js
    }),
  ],
};

const dev = {
  mode: "development",
  devServer: {
    port: 3000, // 端口
    client: {
      // progress: true, // 编译进度条
    },
    static: distPath, // 静态文件提供地址
    open: true, // 自动打开浏览器
    compress: true, // 启动 gzip 压缩
    hot: true, // 启动热更新

    // 设置代理
    proxy: [
      // 将本地 /api/xxx 代理到 localhost:3000/api/xxx
      {
        context: ["/api"],
        target: "http://localhost:3001",
      },
      // 将本地 /api2/xxx 代理到 localhost:3000/xxx
      {
        context: "/sss",
        target: "http://localhost:3002",
        // pathRewrite: {
        //   "/api2": "",
        // },
      },
    ],
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: "file-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(scss|sass)$/,
        use: [
          "style-loader", // 将css插入到html的style标签中
          "css-loader",
          "sass-loader",
          "postcss-loader",
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      ENV: JSON.stringify("development"),
      "process.env": JSON.stringify(process.env),
    }),
    // new webpack.HotModuleReplacementPlugin()
  ],
};

const prod = {
  mode: "production",
  output: {
    // 单出口
    // filename: "bundle.[contenthash:8].js",

    //多出口
    filename: "[name].[contenthash:8].js", // name 即多入口时 entry 的 key

    path: distPath,
    // publicPath: 'http://cdn.abc.cn'  //修改所有静态文件 url前缀
    clean: true, // 在生成文件之前清空文件夹
  },
  module: {
    // noParse: /core-js/,
    rules: [
      // 图片 - 考虑 base64 编码的情况
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: {
          loader: "url-loader",
          options: {
            // 小于 5kb 的图片用 base64 格式产出
            // 否则，依然延用 file-loader 的形式，产出 url 格式
            limit: 5 * 1024,
            // 打包到 img 目录下
            outputPath: "/img1/",
            // 设置图片的 cdn 地址（也可以统一在外面的 output 中设置，那将作用于所有静态资源）
            // publicPath: 'http://cdn.abc.com'
          },
        },
      },
      // 抽离 css
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // 注意，这里不再用 style-loader
          "css-loader",
          "postcss-loader",
        ],
      },
      {
        test: /\.(scss|sass)$/,
        use: [
          MiniCssExtractPlugin.loader, // 注意，这里不再用 style-loader
          "css-loader",
          "sass-loader",
          "postcss-loader",
        ],
      },
    ],
  },
  plugins: [
    // 在项目插入环境变量
    new webpack.DefinePlugin({
      ENV: JSON.stringify("production"),
      "process.env": JSON.stringify(process.env),
    }),
    // 抽离 css 文件
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash:8].css",
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
  ],

  optimization: {
    // 手动启动作用域提升,mode= production下默认启动  只针对ES6模块
    concatenateModules: true,
    // minimize: true,
    minimizer: [
      new TerserJSPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
      // 压缩 css
      new CssMinimizerWebpackPlugin(),
    ],
    splitChunks: {
      chunks: "all",
      /**
      * 每个分组都按照该规则，也可以放在组内按不同规则处理
      * initial 入口chunk，对于异步导入的文件不处理
         async 异步chunk，只对异步导入的文件处理
         all 全部chunk
      */

      // 缓存分组
      cacheGroups: {
        vendor: {
          name: "vendor", // chunk名称
          priority: 1, // 权限优先抽离
          test: /node_modules/, // 匹配文件夹
          minSize: 0, // 最小大小抽离要求
          minChunks: 1, // 最小复用次数抽离要求
        },

        // 公共模块
        common: {
          name: "common",
          priority: 0,
          minSize: 0,
          minChunks: 2,
        },

      },
    },
  },
};

module.exports = (env, args) => {
  console.log(env, args);
  if (process.env.NODE_ENV === "development") {
    return merge(common, dev);
  } else if (process.env.NODE_ENV === "production") {
    return merge(common, prod);
  }
};

console.log(process.env.NODE_ENV);

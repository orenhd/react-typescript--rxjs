
var path = require('path');
var webpack = require('webpack');

var config = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'build.js'
  },
  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
			{
				test: /\.scss$/,
					use: [
          { loader: "style-loader" },
          { loader: "css-loader", 
            options: {
              modules: true,
              localIdentName: '[local]--[hash:base64:5]'
            } 
          }, 
          { loader: "sass-loader" }
        ]
			},
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias: {
      styles: path.resolve(__dirname, './src/shared/styles/')
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  performance: {
    hints: false
  },
  externals: {
	  "react" : "React",
    "react-dom" : "ReactDOM"
	},
  devtool: '#eval-source-map'
}

module.exports = (env) => {
  if (env && env.production) {
    config.devtool = '#source-map'
    config.output.filename = 'build.min.js'
    config.plugins = (config.plugins || []).concat([
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"'
        }
      }),
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        compress: {
          warnings: false
        }
      }),
      new webpack.LoaderOptionsPlugin({
        minimize: true
      })
    ])
  }
  return config;
}

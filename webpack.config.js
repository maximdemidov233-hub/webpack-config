const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizer = require('css-minimizer-webpack-plugin');
// const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

const NODE_ENV = process.env.NODE_ENV;
const IS_DEV = NODE_ENV === 'development';
const IS_PROD = NODE_ENV === 'production';

const filename = ext => IS_DEV ? `bundle.${ext}` : `bundle.[contenthash].${ext}`;

function setupDevtool() {
    if (IS_DEV) return 'eval';
    if (IS_PROD) return false;
}

const optimization = () => {
    const configObj = {};

  if (IS_PROD) {
    configObj.minimizer = [
      new CssMinimizer(),
    ];
  }
  return configObj;

}

module.exports = {
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
    },
    mode: NODE_ENV ? NODE_ENV : 'development',
    devtool: setupDevtool(),
    entry: '/src/index.js',
    devServer: {
        port: 8080,
        open: true,
        hot: IS_DEV,
    },
    output: {
        filename: `./js/${filename('js')}`,
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        assetModuleFilename: IS_DEV ? 'assets/[name][ext]' : 'assets/[name].[contenthash][ext]',
        publicPath: '/assets/',
    },

    optimization: optimization(),

    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html'),
            filename: 'index.html',
            minify: {
            collapseWhitespace: IS_PROD,
    },
        }),

        new MiniCssExtractPlugin({
            filename: filename('css')
        }),
    ],

    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },        
        
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            },

            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },

            {
                test: /\.[tj]sx?$/,
                exclude: /node_modules/,
                use: ['ts-loader'],
            },

            {
                test: /\.(jpe?g|png|webp|gif|svg)$/i,
                use: IS_DEV
                ? []
                : [
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                                progressive: true,
                            },
                            optipng: {
                                enabled: false,
                            },
                            pngquant: {
                                quality: [0.65, 0.9],
                                speed: 4,
                            },
                            gifsicle: {
                                interlaced: false,
                            },
                            webp: {
                                quality: 75,
                            },
                        },
                    },
                ],
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name][ext]'
                }
            },

            {
                test: /\.(woff|woff2)$/i,
                type: 'asset/resource',
                 generator: {
                    filename: 'fonts/[name][ext]'
                }
            },
        ]
    }

}
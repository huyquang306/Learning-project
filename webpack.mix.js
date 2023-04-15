const mix = require('laravel-mix');
const path = require("path");

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.webpackConfig({
    resolve: {
        modules: ['node_modules', path.resolve(__dirname, 'resources')]
    }
});

// Cache busting
mix.version();

// Compile JavaScript
mix.js('resources/js/admin/app.js', 'public/assets/js/admin/app.js')
    .react();

mix.js('resources/js/shop/app.js', 'public/assets/js/shop/app.js')
    .react();

mix.js('resources/js/shop-order/app.js', 'public/assets/js/shop-order/app.js')
    .react();

mix.js('resources/js/customer/app.js', 'public/assets/js/customer/app.js')
    .react();

mix.js('resources/js/customer-order/app.js', 'public/assets/js/customer-order/app.js')
    .react();

mix.copyDirectory('resources/img', 'public/assets/img');

// Debug
mix.sourceMaps();

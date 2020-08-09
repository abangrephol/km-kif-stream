const tailwindcss = require('tailwindcss')
const cssnano = require('cssnano')({
    preset: 'default'
})
const purgecss = require('@fullhuman/postcss-purgecss')({

    // Specify the paths to all of the template files in your project
    content: [
        './src/views/**/*.ejs',
    ],

    // Include any special characters being used in your css
    defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
})
module.exports = {
    "plugins": [
        require('tailwindcss')('tailwind.js'),
        require('autoprefixer')(),
        ...[purgecss, cssnano]
    ]
}
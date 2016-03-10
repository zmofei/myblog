'use strict';

let Dufing = require('dufing');

let site = new Dufing({
    port: 8333
});

site.get(/\/blog\/(\d{0,5})$/, '/blog')
site.get(/\/blog\/article\/(.{24})$/, '/blog/article')

// site.use({
//     response: {},
//     jade: {},
// })

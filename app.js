'use strict';

let Dufing = require('dufing');

let site = new Dufing({
    port: 8333
});

// only for old version 302
site.get(/\/blog\/(.{24})$/, '/blog/old');
//

site.get(/\/blog\/(\d{0,5})$/, '/blog');
site.get(/\/blog\/article\/(.{24})$/, '/blog/article');
site.get(/\/message\/(\d{0,5})$/, '/message');

'use strict';

let Dufing = require('dufing');

let site = new Dufing({
    port: 8333
});

site.use({
    jade: {}
})

var Mongo = require('../../system/mongo/init.js');

var url = require('url');


var render = function() {
  const isEnglish = /himofei\.com/.test(this.req.headers.host);
  var path;
  if (isEnglish) {
    path = this.jade.proto.router.path.replace(/\.\w+$/, '.en.jade');
  }

  var self = this;
  var page = 0;
  var perPage = 10;
  var skip = 0;

  if (self.reqParam && self.reqParam[1]) {
    page = Math.max(self.reqParam[1] - 1, 0);
    skip = perPage * page;
  }

  Mongo.open(function(db) {
    var collection = db.collection('blog');
    var classCollection = db.collection('blog_class');

    var url_parts = url.parse(self.req.url, true);
    var search = url_parts.search;

    var findquery = {
      "state": {
        $in: ["0", 0, null]
      }
    };
    if (url_parts.query.tags) {
      var newTags = [];
      var tags = url_parts.query.tags.split(',');
      for (var i in tags) {
        newTags.push(tags[i]);
        newTags.push(parseInt(tags[i]));
        newTags.push(new RegExp(tags[i]));
      }
      findquery.classid = {
        $in: newTags
      }
    }

    var data = {
      currentPage: page + 1,
      search: search,
    };

    var getBlogClass = new Promise(function(resolve, reject) {
      classCollection.find({}).toArray(function(err, docs) {
        var blogClass = {};
        for (var i in docs) {
          blogClass[docs[i].classid] = docs[i];
          if (isEnglish && blogClass[docs[i].classid]['classname-en']) {
            blogClass[docs[i].classid].classname = blogClass[docs[i].classid]['classname-en']
          }
        }
        data.blogClass = blogClass || [];
        resolve();
      });
    });

    var getCount = new Promise(function(resolve, reject) {
      collection.countDocuments(findquery, function(err, count) {
        data.totalPage = Math.ceil(count / perPage);
        resolve();
      });
    });

    var getBlog = new Promise(function(resolve, reject) {
      collection.find(findquery, {
        projection: { html: 0 },
        limit: perPage,
        skip: skip,
        sort: {
          pubtime: -1
        }
      }).toArray(function(err, docs) {
        if (isEnglish) {
          docs.forEach(item => {
            item.title = item['title-en'] || item.title;
            item.content = item['content-en'] || item.content;
          })
        }
        data.blogs = docs || [];
        resolve();
      });
    });

    Promise.all([getBlogClass, getCount, getBlog]).then(function(val) {
      for (var i in data.blogs) {
        let blog = data.blogs[i];
        let classIds = blog.classid;
        blog.tags = blog.tags || [];
        if (classIds && typeof classIds === 'object') {
          classIds.forEach(classId => {
            blog.tags.push({
              id: classId,
              name: data.blogClass[classId] ? data.blogClass[classId].classname : ''
            });
          });
        }
      }
      self.jade.render({
        data: data,
        path: path
      })
    });
  });
}

exports.get = render;
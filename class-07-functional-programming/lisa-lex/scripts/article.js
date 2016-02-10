// DONE: Wrap the entire contents of this file in an IIFE.
// Pass in to the IIFE a module, upon which objects can be attached for later access.
(function(module) {

  function Article (opts) {
    this.author = opts.author;
    this.authorUrl = opts.authorUrl;
    this.title = opts.title;
    this.category = opts.category;
    this.body = opts.body;
    this.publishedOn = opts.publishedOn;
};
  Article.all = [];

  Article.prototype.toHtml = function() {
    var template = Handlebars.compile($('#article-template').text());
  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);
  this.publishStatus = this.publishedOn ? 'published ' + this.daysAgo + ' days ago' : '(draft)';
  this.body = marked(this.body);

  return template(this);
};

Article.loadAll = function(rawData) {
  rawData.sort(function(a,b) {
    return (new Date(b.publishedOn)) - (new Date(a.publishedOn));
  });

Article.all = rawData.map(function(ele) {
    return new Article(ele);
  });
};

  Article.fetchAll = function(module) {
  if (localStorage.rawData) {
    Article.loadAll(JSON.parse(localStorage.rawData));
    articleView.initIndexPage();
  } else {
    $.getJSON('/data/hackerIpsum.json', function(rawData) {
      Article.loadAll(rawData);
      localStorage.rawData = JSON.stringify(rawData); // Cache the json, so we don't need to request it next time.
      articleView.initIndexPage();
    });
  }
};

  Article.numWordsAll = function() {
  return Article.all.map(function(article) {
    return article.body.match(/\b\w+/g).length;
  })
  .reduce(function(a, b) {
    return a + b;// Sum up all the values in the collection
  })
};

  Article.allAuthors = function() {
  return Article.all.map(function(article) {
    return article.author;
  }) // Don't forget to read the docs on map and reduce!
  .reduce(function(names, name) {
    if(names.indexOf(name) === -1) {
      names.push(name);
    }
    return names;
  }, []);
};

  Article.numWordsByAuthor = function() {
  return Article.allAuthors().map(function(author) {
    var count = Article.all.filter(function(ele, idx) {
      return ele.author === author;
    })
    .map(function(article) {
      return article.body.match(/\b\w+/g).length;
    })
    .reduce(function(a ,b) {
      return a + b;
    })
    return {
      name: author,
      numWords: count
    }
  })
};

module.Article = Article;
}(window));

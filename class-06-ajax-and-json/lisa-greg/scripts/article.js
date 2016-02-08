function Article (opts) {
  this.author = opts.author;
  this.authorUrl = opts.authorUrl;
  this.title = opts.title;
  this.category = opts.category;
  this.body = opts.body;
  this.publishedOn = opts.publishedOn;
}

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

  rawData.forEach(function(ele) {
    Article.all.push(new Article(ele));
  })
}

Article.fetchAll = function() {
  if (localStorage.rawData) {
    $.ajax({
      type: 'HEAD',
      url: 'data/hackerIpsum.json',
      success: function(data, message, xhr) {
        console.log('xhr is ' + xhr);
        var eTag = xhr.getResponseHeader('eTag');
        if (!localStorage.eTag || eTag !== localStorage.eTag) {
          localStorage.clear();
          localStorage.setItem('eTag' , JSON.stringify(eTag));
          Article.fetchAll();
        } else {
        Article.loadAll(JSON.parse(localStorage.rawData));
        }
      }
    });
      Article.loadAll(JSON.parse(localStorage.rawData));
      articleView.initIndexPage();
  } else {
    $.ajax({
      type: 'GET',
      url: 'data/hackerIpsum.json',
      success: function(data, message, xhr) {
        var eTag = xhr.getResponseHeader('eTag');
        localStorage.setItem('rawData', JSON.stringify(data));
        Article.loadAll(data);
      }
  });
}
}

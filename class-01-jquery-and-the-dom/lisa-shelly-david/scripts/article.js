var articles = [];



function Article (opts) {

  this.title = opts.title;
  this.category = opts.category;
  this.author = opts.author;
  this.authorUrl = opts.authorUrl;
  this.publishedOn = opts.publishedOn;
  this.body = opts.body
}


Article.prototype.toHtml = function() {
  var $newArticle = $('article.template').clone();

  $newArticle.attr('data-category', this.category);
  //author
  $newArticle.find('address a').html(this.author);
  //author URL
  $newArticle.find('address a').attr('href', this.authorUrl);
  //title
  $newArticle.find('header h1').html(this.title);
  //body
  $newArticle.find('.article-body').html(this.body);



  // Include the publication date as a 'title' attribute to show on hover:
  $newArticle.find('time[pubdate]').attr('title', this.publishedOn);
  $newArticle.hover(this.publishOn);

  // Display the date as a relative number of "days ago":
  $newArticle.find('time').html('about ' + parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000) + ' days ago');

  $newArticle.append('<hr>');


  $newArticle.removeClass('template');
  return $newArticle;
}

rawData.sort(function(a,b) {
  return (new Date(b.publishedOn)) - (new Date(a.publishedOn));
});

rawData.forEach(function(ele) {
  articles.push(new Article(ele));
})

articles.forEach(function(a){
  $('#articles').append(a.toHtml())
});

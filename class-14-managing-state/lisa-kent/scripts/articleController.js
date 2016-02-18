(function(module) {
  var articlesController = {};

  Article.createTable();  // Ensure the database table is properly initialized
  /*article page handler.Shows only the articles that in the context's articles attr*/
  articlesController.index = function(ctx, next) {
    articleView.index(ctx.articles);
  };

  /*article page pre-handler for showing a single article by id.
  Puts a single article by id into the context's articles attr*/
  articlesController.loadById = function(ctx, next) {
    var articleData = function(article) {
      ctx.articles = article;
      next();
    };

    Article.findWhere('id', ctx.params.id, articleData);
  };

  // article page pre-handler for showing all articles by a specific author
  articlesController.loadByAuthor = function(ctx, next) {
    var authorData = function(articlesByAuthor) {
      ctx.articles = articlesByAuthor;
      next();
    };

    Article.findWhere('author', ctx.params.authorName.replace('+', ' '), authorData);
  };

    // article page pre-handler for showing all articles by a specific category
  articlesController.loadByCategory = function(ctx, next) {
    var categoryData = function(articlesInCategory) {
      ctx.articles = articlesInCategory;
      next();
    };

    Article.findWhere('category', ctx.params.categoryName, categoryData);
  };

    // article page pre-handler for showing all articles
  articlesController.loadAll = function(ctx, next) {
    var articleData = function(allArticles) {
      ctx.articles = Article.all;
      next();
    };

    if (Article.all.length) {
      ctx.articles = Article.all;
      next();
    } else {
      Article.fetchAll(articleData);
    }
  };


  module.articlesController = articlesController;
})(window);

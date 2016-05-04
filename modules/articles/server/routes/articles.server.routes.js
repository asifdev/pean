'use strict';

/**
 * Module dependencies
 */
var articlesPolicy = require('../policies/articles.server.policy'),
  articles = require('../controllers/articles.server.controller');

module.exports = function(app) {
  // Articles collection routes
  app.route('/api/articles').all(articlesPolicy.isAllowed)
    .get(articles.read)
    .post(articles.create);

  // Single article routes
  app.route('/api/articles/:id').all(articlesPolicy.isAllowed)
    .put(articles.update)
    .delete(articles.delete);
};
'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash'),
  chalk = require('chalk'),
  db = require('../../../../config/lib/sequelize'),
  path = require('path'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Query builder
 * [queryBuilder description]
 * @param  {[type]} req [description]
 * @return {[type]}     [description]
 */
var queryBuilder = function(req) {
  console.log('* article.server.controller - queryBuilder *');

  var search = JSON.parse(req.query.search);

  var queries = [],
    andConditions = [],
    orConditions = [];

  if (search.article) {
    orConditions.push({
      'title': {
        $like: '%' + search.article + '%'
      }
    }, {
      'content': {
        $like: '%' + search.article + '%'
      }
    });
  }

  if (search.startDate) {
    andConditions.push({
      'createdAt': {
        $gt: search.startDate
      }
    });
  }

  if (search.endDate) {
    andConditions.push({
      'createdAt': {
        $lt: search.endDate
      }
    });
  }

  if (!_.isEmpty(andConditions)) {
    queries.push({
      $and: andConditions
    });
  }
  
  if (!_.isEmpty(orConditions)) {
    queries.push({
      $or: orConditions
    });
  }
  return queries;
};

/**
 * Create a article
 */
exports.create = function(req, res) {
  console.log('* articles.server.controller - create *');

  var data = req.body;

  // save and return and instance of article on the res object. 
  db.Article
  .create(data)
  .then(function(newArticle) {
    res.json(true);
  })
  .catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Delete an article
 */
exports.delete = function(req, res) {
  console.log('* articles.server.controller - delete *');

  var id = req.params.id;

  db.Article
    .findOne({
      where: {
        id: id
      }
    })
    .then(function(article) {
      article
        .destroy()
        .then(function() {
          res.json(true);
        })
        .catch(function(err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        });
    })
    .catch(function(err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
};

/**
 * Read
 * [read description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.read = function(req, res) {
  console.log('* article.server.controller - read *');

  var limit = req.query.limit,
    offset = req.query.offset,
    order = req.query.order,
    where = queryBuilder(req);

  db.Article
    .findAndCountAll({
      limit: limit,
      offset: offset,
      order: [order],
      where: where
    })
    .then(function(results) {
      console.log('* article.server.controller - read *' + results);
      res.json(results);
    })
    .catch(function(err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
};

/**
 * Update
 * [update description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.update = function(req, res) {
  console.log('* article.server.controller - update *');

  var data = req.body,
    id = req.params.id;
    // id = req.body.id;

  db.Article
    .findOne({
      where: {
        id: id
      }
    })
    .then(function(article) {
      article
        .update(data)
        .then(function() {
          res.json(true);
      })
      .catch(function(err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      });
    })
    .catch(function(err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
};

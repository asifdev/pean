'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash'),
  chalk = require('chalk'),
  path = require('path'),
  config = require(path.resolve('./config/config')),
  db = require(path.resolve('./config/lib/sequelize')),
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
      'component_id': {
        $like: '%' + search.article + '%'
      }
    }, {
      'description': {
        $like: '%' + search.article + '%'
      }
    }, {
      'name': {
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
  // console.log('* articles.server.controller - create *');

  // save and return and instance of article on the res object. 
  db.Article
  .create({
    title: req.body.title,
    content: req.body.content,
    userId: req.user.id
  })
  .then(function(newArticle) {
    return res.json(newArticle);
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
  // console.log('* articles.server.controller - delete *');

  var id = req.params.articleId;

  db.Article
    .findOne({
      where: {
        id: id
      },
      include: [
        db.User
      ]
    })
    .then(function(article) {
      article.destroy()
        .then(function() {
          return res.json(article);
        })
        .catch(function(err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        });

      return null;
    })
    .catch(function(err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
};

/**
 * List of Articles
 */
exports.list = function(req, res) {
  // console.log('* articles.server.controller - list *');

  db.Article.findAll({
    include: [
      db.User
    ]
  })
  .then(function(articles) {
    return res.json(articles);
  })
  .catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Show the current article
 */
// exports.read = function(req, res) {
//   // console.log('* articles.server.controller - read *');

//   var id = req.params.articleId;

//   db.Article.find({
//     where: {
//       id: id
//     },
//     include: [
//       db.User
//     ]
//   })
//   .then(function(article) {
//     return res.json(article);
//   })
//   .catch(function(err) {
//     return res.status(400).send({
//       message: errorHandler.getErrorMessage(err)
//     });
//   });
// };

/**
 * Read
 * [read description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.read = function(req, res) {
  console.log('* article.server.controller - read *');

  // var limit = req.query.limit,
  //   offset = req.query.offset,
  var order = req.query.order,
    where = queryBuilder(req);

  db.Article
    .findAndCountAll({
      // limit: limit,
      // offset: offset,
      order: [order],
      where: where
    })
    .then(function(results) {
      // console.log('* article.server.controller - read *' + results);
      res.json(results);
      // $scope.results = result.data.rows;
      // console.log($scope.general);
    })
    .catch(function(err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
};

/**
 * Update a article
 */
// exports.update = function(req, res) {
//   // console.log('* articles.server.controller - update *');

//   var id = req.params.articleId;

//   db.Article
//     .findOne({
//       where: {
//         id: id
//       },
//       include: [
//         db.User
//       ]
//     })
//     .then(function(article) {
//       article.updateAttributes({
//         title: req.body.title,
//         content: req.body.content
//       })
//       .then(function() {
//         return res.json(article);
//       })
//       .catch(function(err) {
//         return res.status(400).send({
//           message: errorHandler.getErrorMessage(err)
//         });
//       });

//       return null;
//     })
//     .catch(function(err) {
//       return res.status(400).send({
//         message: errorHandler.getErrorMessage(err)
//       });
//     });
// };
/**
 * Update
 * [update description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.update = function(req, res) {
  console.log('* general.server.controller - update *');

  var data = req.body,
    // id = req.params.id;
    id = req.body.id;

  db.Article
    .findOne({
      where: {
        id: id
      },
      include: [
        db.User
      ]
    })
    .then(function(article) {
      article.updateAttributes({
        title: req.body.title,
        content: req.body.content
      })
      .then(function() {
        return res.json(article);
      })
      .catch(function(err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      });

      return null;
    })
    .catch(function(err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
};

/**
 * Initial Table
 * [read description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.initTable = function(req, res) {
  console.log('* article.server.controller - initTable *');

  // var offset = req.query.offset,
  //   limit = req.query.limit,
  var order = req.query.order;

  // var where = queryBuilder(req);
  // Project.findAll({ limit: 10 })

  db.Articles
    .findAll({
      // limit: limit,
      // offset: offset,
      order: [order],
      where: {
        id: {
          $ne: null
        }
      }
    })
  // db.General.findAll({
  //   include: [
  //     db.User
  //   ]
  // })
    .then(function(results) {
      console.log('* article.server.controller - initTable *');
      res.json(results);
    })
    .catch(function(err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
};

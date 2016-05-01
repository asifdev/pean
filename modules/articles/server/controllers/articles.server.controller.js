'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  db = require(path.resolve('./config/lib/sequelize')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Query builder
 * [queryBuilder description]
 * @param  {[type]} req [description]
 * @return {[type]}     [description]
 */
var queryBuilder = function(req) {
  console.log('* general.server.controller - queryBuilder *');

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

  queries.push({
    $and: andConditions
  });
  queries.push({
    $or: orConditions
  });

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
  //   order = req.query.order;

  var where = queryBuilder(req);

  db.Article
    .find({
      // limit: limit,
      // offset: offset,
      // order: [order],
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

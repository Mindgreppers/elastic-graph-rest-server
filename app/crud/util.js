var _ = require('lodash')
var async = require('async-q')
var debug = require('debug')('crud/util')
/**
 * @param docs
 * @param joins Optional. Either joins or context must be specified
 * @param context Optional. Either joins or context must be specified
 * @param lang
 *
 */
module.exports.resolveAndEmit = (params, socket) => {
  return async.each(params.docs, (esDoc) => {
    if (params.context || params.joins) {
      return require('../utils/resolveJoins')(
        esDoc,
        params.lang,
        params.context,
        params.joins
      )
    } else {
      return esDoc
    }
  })
  .then((resolvedDocs) => {
    resolvedDocs.forEach((doc) => {
      doc.fields = doc.fields || doc._source
      delete doc._source

      socket.emit('r-entity.done', {
        message: 'Successfully read ' + doc._type,
        status: 200,
        response: doc,
        params: {
          _id: doc._id,
          _type: doc._type,
          lang: params.lang,
          context: params.context
        }
      })
    })
  })
}


const _ = require('lodash')
const debug = require('debug')('crudRead')
const es = require('../es')
const execute = es.dsl.execute.bind(es.dsl)

/**
 * @param {String} _type
 * @param {String} _id
 * @param {String} langs - Optional
 * @param {String} joins - Optional
 */
module.exports = (params, res, deep) => {
  var missingArgumentMessage
  if (!params._id) {
    missingArgumentMessage = '_id missing'
  } else if (!params.type && !params._type) {
    missingArgumentMessage = 'type missing'
  }

  if (missingArgumentMessage) {

    res.status(404).send({
      message: 'Illegal Argument Exception: ' + missingArgumentMessage
    })
  }

  const ctx = new es.Cache(es)
  _.merge(ctx, params)

  //return execute('get *_type *_id. Join from *joins', ctx)
  return deep ? es.deep.get(params) : es.get.collect(params)
  .then((response) => {

    res.status(200).send({
      message: 'Successfully read ' + params._type,
      response: response,
      params: params
    })

    return response
  })
  .catch((err) => {

    res.status(500).send({
      message: 'Error in reading ' + params._type,
      error: err,
      params: params
    })

    return err
  })
}
if (require.main === module) {
  module.exports({
    _type: 'event',
    _id: 'AVeuJeQ9jGz7t7QfUg_M',
    joins: 'read'
  }, {
    emit: function() {
      console.log(arguments)
    }
  })
  .then(function(res) {
    debug('done', JSON.stringify(res))
  })
  .catch(debug)
}

var debug = require('debug')('crudUpdate')
var _ = require('lodash')
const es = require('../es')
const execute = es.dsl.execute.bind(es.dsl)

/**
 * @param _id
 * @param _type
 * @param update the update instructions as per js-object-updater module
 *
 */
module.exports = function(params, socket) {
  var missingArgumentMessage
  if (!(params._id && (params._type || params.type)) && !params.entities) {
    missingArgumentMessage = 'Either _id/_type/type or entities must be specified'
  }
  if (!params.update) {
    missingArgumentMessage = 'update missing'
  }

  if (missingArgumentMessage) {

    res.status(400).send({
      message: 'Illegal Argument Exception: ' + missingArgumentMessage,
      params: params
    })

    return
  }

  return es.deep.update(params)
  .then((updateRes) => {
    socket.emit('u-entity.done', {
      message: 'Successfully updated ',
      status: 204,
      response: res,
      params: params
    })

    const ctx = {entity: res}

    return es.deep.get({_id: params._id, _type: params._type, lang: params.lang, joins: 'read'})
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
  })
  .catch((err) => {
    res.status(500).send({
      message: 'Error in updating ' + params._type + err.stack,
      error: err,
      params: params
    })

    return err
  })
}


if (require.main === module) {
  module.exports ({
    _id: 'AVeawbnNW2vhiwtp9F2D',_type: 'event',lang: 'english', context: 'web.read',
    update: {set: {english: {title: 'Finding Common Ground'}}}
  }, {
    emit: (event, data) => {
      console.log(event, data)
    }
  })
  .then(debug)
  .catch(debug)
}

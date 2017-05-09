const debug = require('debug')('crudSearch')
const es = require('../es')

module.exports = function(params, res, deep) {

  var missingArgumentMessage

  if (!params.lang) {
    missingArgumentMessage = 'lang missing'
  } else if (!params.context) {
    missingArgumentMessage = 'context missing'
  }

  if (missingArgumentMessage) {
    res.status(400).send({
      message: 'Illegal Argument Exception: ' + missingArgumentMessage
    })
  }

  return deep ? es.deep.search(params) : es.index.collect(params)
    .then(function(response) {

      res.status(200).send({
        message: 'Successfully fetched all ',
        response: response,
        params: params,
      })

      return response
    }).catch(function(err) {

      res.status(500).send({
        message: 'Error in searching ' + params.q,
        error: err,
        params: params
      })

      return err
    })
}

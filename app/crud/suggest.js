const debug = require('debug')('crudSuggest')
const es = require('../es')

module.exports = function(params, socket, deep) {

  var missingArgumentMessage

  if (!params.q) {
    missingArgumentMessage = 'query missing'
  } else if (!params._type) {
    missingArgumentMessage = 'type missing'
  }

  if (missingArgumentMessage) {

    res.status(400).send({
      message: 'Illegal Argument Exception: ' + missingArgumentMessage
    })
  }

  return deep ? es.deep.search(params) : es.search.collect(params)
    .then(function(response) {

      res.status(200).send({
        message: 'Successfully read suggestions for ' + params.q,
        response: response,
        params: params,
      })

      return response
    }).catch(function(err) {

      res.status(500).send({
        message: 'Error in reading suggestions for ' + params.q,
        error: err,
        params: params
      })

      return err
    })
}

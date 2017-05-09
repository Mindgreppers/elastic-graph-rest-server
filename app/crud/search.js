const debug = require('debug')('crudSearch')
const es = require('../es')
const _ = require('lodash')

module.exports = function(params, res, deep) {

  var missingArgumentMessage

  if (!params.lang) {
    missingArgumentMessage = 'lang missing'
  }

  if (missingArgumentMessage) {

    res.status(400).send({
      message: 'Illegal Argument Exception: ' + missingArgumentMessage,
    })
  }

  return deep ? es.deep.search(params) : es.search.collect(params)
  .then(function(response) {

    res.status(200).send({
      message: params.q ? 'Successfully searched ' + params.q : 'Successfully searched',
      response: response,
      params: params,
    })

    return response
  }).catch(function(err) {

    res.status(500).send({
      message: 'Error in searching ' + params.q,
      error: _.isEmpty(err) ? new Error().stack : err,
      params: params
    })

    return err
  })
}

if (require.main === module) {
  module.exports(
{"_index":"old-content-to-audio-channels","_type":"old-content-to-audio-channel","query":{"filtered":{"filter":{"bool":{"must":[{"query":{"match":{"content_id":"1167"}}}],"must_not":[],"should":[]}}}},"joins":null,"size":20}
    /*q: '',
    _type: ['event'],
    lang: ['english', 'tibetan'],
    joins: 'search',
    size: 20
  }*/, {
    emit: function() {
      console.log(arguments)
    }
  })
  .then(function(res) {
    debug('done', JSON.stringify(res))
  })
  .catch(debug)
}

const debug = require('debug')('crudCreate')
const es = require('../es')
const execute = es.dsl.execute.bind(es.dsl)
const _ = require('lodash')

module.exports = (params, res, deep) => {

  params.type = params._type || params.type
  params._id = params._id || params.id

  var missingArgumentMessage

  if (!params.type) {
    missingArgumentMessage = 'type missing'
  } else if (!params.body) {
    missingArgumentMessage = 'body missing'
  }

  if (missingArgumentMessage) {
    res.status(400).send({
      message: 'Illegal Argument Exception: ' + missingArgumentMessage
    })
  }

  return deep ? es.deep.index(params) : es.index.collect(params)
  .then((response) => {

    res.status(201).send({
      message: params.type + ' created successfully!',
      response: _.pick(response, ['_id', '_type']),
    })
  })
  .catch((err) => {

    res.status(500).send({
      message: 'Error in creating ' + params.index + ' in database',
      error: err,
      params: params
    })
  })
}
if (require.main === module) {
  /*module.exports({'_type': 'event','body': {'english': {'title': 'dddddddd'}, 'startingDate': 1546281000000,'endingDate': 1003516200000,'venues':['1001'],'classifications':['44'],'languages':['1'],'speakers':[]}}/*{
    _type: 'file',
    _id: '1112',
    body: {
      folders: ['4'],
      processingStatus: 'edit'
    }
  }, (e, m) => {
        console.log(m, e)
      }
  )*/
 // .then(debug)
 // .catch((err) => {debug(err, 'err')})
}


const debug = require('debug')('crudLink')
const async = require('async-q')
const _ = require('lodash')
const Q = require('q')
const es = require('../es')
const execute = es.dsl.execute.bind(es.dsl)

/**
 * Link entities of a particular type, along a particular relationship,
 * with entities of possibly different types. The linking goes through provided:
 * a. Schema.e1.e1Relation definition exists
 * b. All e2 types are allowed as per schema.e1.e1Relation definition
 * c. If the reverse relationship name is specified in schema.e1.e1Relation,
 *    and is specified in e2 schema,
 *    and it carries e1Relation as the reverse name under which e1Type is valid destination
 *
 * If the operation is not allowed for any combination of e1+e2, then an exception is thrown
 * immediately without applying any changes anywhere.
 *
 * @params e1
 * @params e1ToE2Relation
 * @params e2Entities single or array of entities of possibly multiple types, with _type and _id fields
 *
 */
module.exports = (params, res) => {

  let e2Entities = params.e2Entities || [params.e2]
  if (!_.isArray(e2Entities)) {
    e2Entities = [params.e2Entities]
  }

  if (!params.e1 || (!params.e1ToE2Relation && !params.e2ToE1Relation) || !e2Entities) {

    res.status(400).send({
      message: 'Illegal Argument Exception. Must specify e1, e1ToE2Relation, e2Entities',
    })

    return Q()
  }

  return es.deep.link({
    e2Entities: _.clone(e2Entities),
    e1: _.clone(params.e1),
    e1ToE2Relation: params.e1ToE2Relation,
    isOwn: true
  })
  .then((result) => {

    const emitEntities = e2Entities
    emitEntities.push(params.e1)

    async.map(emitEntities, (entity) => {

      let newEntity = {_id: entity._id, _type: entity._type, joins: params.joins, lang: params.lang}

      return es.deep.get(newEntity)
    }).then((response) => {

      res.status(201).send({
        message: 'linked successfully!',
        params: params,
        entities: response
      })
    })
  })

}
if (require.main === module) {
  module.exports({
    e1: {
      _type: 'event',
      _id: '229'
    },
    e2Entities: [{
      _type: 'speaker',
      _id: 'ae417f80525a262a95139145d4af50ec50226a99'
    }],
    e1ToE2Relation: 'speakers'
  }, {
    send: function(response) {
      console.log('response', response)
    }
  })
  .then(function(res) {
    debug('done', JSON.stringify(res))
  })
  .catch(debug)
}

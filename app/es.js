var EpicSearch = require('epicsearch')
var es = new EpicSearch(process.argv[2])

module.exports = es

var _ = require('lodash')
var readUser = require('./read')

const login = (body, res) => {

  if(body.username) {
    var userAuth = _.pick(body, 'username', 'password');
    readUser(userAuth, res)
  } else {
    res.status(404).send({message: 'Please enter valid username.'})
  }
}

const checkCookie = (cookies, res) => {
  if(cookies.user) {
    var params = {username: cookies.user}
    readUser(params, res) 
  }
  else {
    res.status(404).send({message: 'Please Login'})
  }
}

const logout = (res) => {
  res.clearCookie('user')
  res.status(200).json({message: 'User seccessful logout.'})
}

module.exports.login = login
module.exports.checkCookie = checkCookie
module.exports.logout = logout

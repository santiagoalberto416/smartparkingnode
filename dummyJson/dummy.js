// var jsonServer = require('json-server')

// var server = jsonServer.create()

// server.use(jsonServer.defaults)
// server.use('/db1', jsonServer.router('FirstGraph.json'))
// server.use('/db2', jsonServer.router('fourApi.json'))
// server.use('/db3', jsonServer.router('SecondGraph.json'))
// server.use('/db4', jsonServer.router('ThirdGraph.json'))

// server.listen(8081, () => {
//   console.log('JSON Server is running')
// })

// server.js 
// const jsonServer = require('json-server')
// const server = jsonServer.create()
// const middlewares = jsonServer.defaults()
 
 

// server.use(middlewares)
// server.use('/db1', jsonServer.router('FirstGraph.json'))
// server.use('/db2', jsonServer.router('fourApi.json'))
// server.use('/db3', jsonServer.router('SecondGraph.json'))
// server.use('/db4', jsonServer.router('ThirdGraph.json'))
// server.listen(8081, () => {
//   console.log('JSON Server is running')
// })

module.exports = function() {
  return {
        one: require('./fourApi.json'),
        two: require('./FirstGraph.json'),
        three: require('./SecondGraph.json'),
        four: require('./ThirdGraph.json'),
        five: require('./geojson.json')
  }
}
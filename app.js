var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	nicknames = {};

var mysql = require('mysql');

var connected = false;

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "testInsert"
});

conect();
	
	//server.listen(process.env.PORT, process.env.IP);
	server.listen(8081, function(){
	  console.log('listening on *:8081');
	});
	app.use(express.static('web'));

	
	app.get('/', function(req, res){
	 res.sendFile(__dirname + '/web/display.html');
	});
	
	
io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('some event', { for: 'everyone' });
  });
  
  socket.on('onReceiveChange', function(msg){
    console.log('message: ' + msg);
    var response = JSON.parse(msg);
    insert(response.id, response.state);
    io.emit('sendChangeToDash', msg);
  });
});


function conect(){
  con.connect(function(err) {
  if (err) {
      connected = false;
      throw err;
  }
      console.log("Connected!");
      connected = true;
   });
}

function insert(id, state) {
    if(connected){
        var sql = "INSERT INTO `activity`(`id`, `id_space`, `state`, `date`) VALUES (null,"+ id +",'"+ state +"',NOW())";
          con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
        });
    }else{
        conect()
        console.log("trying to reconect to database");
    }
    
}




    
var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	nicknames = {};

  var mysql = require('mysql');
  
  var connected = false;
  
  var con = mysql.createConnection({
    host: "5.79.67.193",
    user: "db_u1403",
    password: "BNmXfvwHd",
    database: "parking"
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
  console.log('Soy la función insert');
    if(connected){
          var numState = 0;
          console.log('state: ' + state)
          if(state == "free"){
            numState = 1;
          } else if (state == "ocupated"){
            numState = 2;
          }else{
            return;
          }
          var sql = "INSERT INTO `sensor_activities`(`id`, `sensor_id`, `state`, `created_at`, `updated_at`) VALUES (null,"+ id +",'"+ numState +"',NOW(), NOW())";
          con.query(sql, function (err, result) {
          if (err) throw err;
          
          console.log("1 record inserted");
          
          var update = "update sensors set state ="+ numState + " where id = " +id;
          
          con.query(update, function(err, result){
            if(err) throw err;
            console.log('update succesful');
          });
          
        });
    }else{
        conect();
        console.log("trying to reconect to database");
    }
    
}




    
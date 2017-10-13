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
	server.listen(8082, function(){
	  console.log('listening on *:8082');
	});
	app.use(express.static('web'));

	
	app.get('/', function(req, res){
	 res.sendFile(__dirname + '/web/display.html');
	});
	
	
io.on('connection', function(socket){
  console.log('a user connected with id ' + socket.id);
  socket.on('disconnect', function(socket){
    console.log('user disconnected' + socket.id);
  });
  
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('some event', { for: 'everyone' });
  });
  
  socket.on('refreshTrend', function(){
    io.emit('sendSignalRefesh', '');
    console.log('puto socket :v')
  });
  
  socket.on('registerUser', function(user){
    var response = JSON.parse(user);
    var iduser = response.iduser;
    var idspace = response.idspace;
  });
  
  socket.on('notifySecurity', function(msg){
    io.emit('sendDashboardSecurity', msg);
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
          var sql = "call sp_add_activity("+id+","+numState+","+1+")";
          con.query(sql, function (err, result) {
          if (err) throw err;
          
          console.log("1 record inserted");
          
          var update = "call sp_add_activity("+id+","+numState+","+2+")";
          
          con.query(update, function(err, result){
            if(err) throw err;
            io.emit('refreshTrend', '');
            console.log('update succesful');
          });
          
        });
    }else{
        conect();
        console.log("trying to reconect to database");
    }
    
}

/// to restart service 
/// install
// sudo npm install -g pm2
// pm2 start app.js --watch



    
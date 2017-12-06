var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	nicknames = {};

  var mysql = require('mysql');

  var connected = false;

//-----------------------------------------------------------------------------------------------------------
// here is the security implementation
// here are stored the id of the users online
// format of object [iduser, idplace]

var contactOnLine = []

// first is add a user
// check if exist 
// and return true if is corrected inserted
function addUserToSecuritySystem(idUser, idPlace){
    var existUser = false;
    for(var i = 0; i < contactOnLine.length;i++){
  			var contactData = contactOnLine[i]
  			if(contactData[0]==idUser){
  			  existUser = true;
  			}
  	}
  	if(existUser==false){
  	  contactOnLine.push([idUser, idPlace])
  	  console.log("user with id "+ idUser + " is address " + idPlace)
  	}
  	return existUser
}

// check if user exist on the array
/// first is add a user
function checkIfUserIsOut(idPlace){
    for(var i = 0; i < contactOnLine.length;i++){
			var contactData = contactOnLine[i]
			if(contactData[1]==idPlace){
				return contactData[0]
			}
		}
		return 0
}

// check if user exist on the array
/// first is add a user
function removeUser(idUser){
    var availablespaces = ""
    for(var i = 0; i < contactOnLine.length;i++){
			var contactData = contactOnLine[i]
			availablespaces = availablespaces + "IDUSER : " + contactData[0] + " , IDSPACE" + contactData[1] + " , IDUSER GETTING OUT "+ idUser ;
			if(contactData[0]==idUser){
				contactOnLine.splice(i, 1);
				availablespaces = availablespaces + "DELETED IDUSER : " + contactData[0] + " , IDSPACE" + contactData[1] ;
			}
		}
		console.log(availablespaces)
		return false
}

//-----------------------------------------------------------------------------------------------------------

//Connection
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

  socket.on('registerUser', function(user){
    var response = JSON.parse(user);
    var iduser = response.iduser;
    var idspace = response.idspace;
		if(addUserToSecuritySystem(iduser, idspace)){
		  // emit that other user is using that spot
		  io.emit('notifySpot'+iduser, "{\"state\": 0, \"description\": \"ocupated spot\"}");
		  console.log("{\"state\": 0, \"description\": \"ocupated spot\"}")
		}else{
		  // emit that spot is free
		  io.emit('notifySpot'+iduser, "{\"state\": 1, \"description\": \"free spot\"}");
		  console.log("{\"state\": 1, \"description\": \"free spot\"}")
		}
		
  });

  socket.on('notifySecurity', function(msg){
    console.log(msg);
    removeUser(msg.iduser)
    io.emit('sendDashboardSecurity', msg);
  });

  socket.on('onReceiveChange', function(msg){
    console.log('message: ' + msg);
    var response = JSON.parse(msg);
    insert(response.id, response.state);
    io.emit('sendChangeToDash', msg);
		// here i sent the notification to the user
		var idOfUser = checkIfUserIsOut(response.id);
		if(idOfUser!=0){
			// se emite a el id del usuario o del dispositivo que se dio de alta
		  io.emit("socketUser"+idOfUser, "user with id "+idOfUser+" has gone out");
		  
		  console.log("has gone out user "+idOfUser)
		}
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

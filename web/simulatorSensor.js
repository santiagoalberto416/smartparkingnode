var socket = io();

socket.on("sendChangeToDash", function(data){
    var response = JSON.parse(data);
    var id = response.id;
    var state = response.state;
    changeSpecificParkLot(id, state);
})

$("#activateButton").click(function (){
    socket.emit('onReceiveChange', '{"id":4, "state":"free"}');
    //changeSpecificParkLot(10, "free");
});
          
$("#waitingButton").click(function (){
    socket.emit('onReceiveChange', '{"id":4, "state":"parking"}');
    //changeSpecificParkLot(10, "parking");
});

$("#desactivateButton").click(function (){
    socket.emit('onReceiveChange', '{"id":4, "state":"ocupated"}');
    //changeSpecificParkLot(10, "ocupated");
});
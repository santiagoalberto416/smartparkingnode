
var socket = io();

// ids: this is the ids that are not simulated
// geojson: this will have the full geojson
// mode: ocupated or free
function simulator(ids, mode){
    if(mode == "Ocupated"){
        // here all space exept ids will be red(ocupated)
        
        $.getJSON('geojson.json', function(data) {
            $.each(data.features, function(feature) {
              socket.emit('onReceiveChange', '{"id":'+feature.properties.id+', "state":"ocupated"}');
              console.log('{"id":'+feature.properties.id+', "state":"ocupated"}');
            });
         }); 
        
    }else if(mode == "Free"){
         // here all space exept ids will be green(Free)
         $.getJSON('geojson.json', function(data) {
             
            var idsSimulated = [];
             
            $.each(data.features, function(feature) {
              socket.emit('onReceiveChange', '{"id":'+feature+', "state":"free"}');
              idsSimulated.push(feature);
              console.log(feature);
            });
            
            setTimeout(function repeatCicle(argument) {
                while(true){
                    $.each(idsSimulated, function(id) {
                        console.log('id:' + id);
                        //sleep(2000);
                        console.log('waiting');
                        socket.emit('onReceiveChange', '{"id":'+id+', "state":"ocupated"}');
                        //sleep(2000);
                        console.log('ocupated');
                        socket.emit('onReceiveChange', '{"id":'+id+', "state":"ocupated"}');
                        //sleep(4000);
                        console.log('waiting');
                        socket.emit('onReceiveChange', '{"id":'+id+', "state":"parking"}');
                        //sleep(2000);
                        console.log('free');
                        socket.emit('onReceiveChange', '{"id":'+id+', "state":"free"}');
                    });
                }
            }, 2000)
            
         }); 
    }
}

function sleep(delay) {
        var start = new Date().getTime();
        while (new Date().getTime() < start + delay);
}

var ids = [1,2,3];
simulator(ids,"Free");

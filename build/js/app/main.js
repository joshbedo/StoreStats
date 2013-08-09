define(["jquery", "socketio"], function($, io) {
    //the jquery.alpha.js and jquery.beta.js plugins have been loaded.
 		var socket = io.connect('http://localhost:3000');

          socket.on('purchase', function (data) {
            console.log(data);
          });

          socket.on('leave', function (data) {
            console.log(data);
          });

            $(function(){
                $('.btn').click(function(ev){
                    socket.emit('buy', { product: 'cool-shirt' });
                    ev.preventDefault();
                })
            });
});
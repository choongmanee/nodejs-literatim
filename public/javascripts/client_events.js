io = io.connect();

var welcome = function() {
    var room = $('#room').val();
    var username = $('#user').val();
    console.log('Joining room:',room);
    console.log('Username:',username);

    if (room !=="") {
        io.emit(
            'got_a_new_user',
            {name: username,
            room: room}
        );
    } else {
        location.reload();
    }
};

io.on(
    'setup_new_user',
    function(data) {

        // set up input text box for chat
        console.log('set_up_user:',data.name);
		$('#chat').append(
            '<input type="text" class="name" id="chat_box" onchange="send_message()"/>\
            <span class="glyphicon glyphicon-pencil"></span>'
        );

        // show all users
        $.each(data.names,function(i,name){
            $('#users').append(
                '<div class="col-xs-12 col-sm-6 col-md-6 user">\
                    <span>'+name.replace("_"," ")+'</span></br>\
                    <video autoplay></video>\
                </div>'
            );
        });

        document.title = 'literat.im[Room: '+data.room+']';
	}
);

io.on(
	'add_newest_user',
	function(data) {
		console.log(data.name);
		$('#users').append(
			'<div class="col-xs-12 col-sm-6 col-md-6 user">\
                <span>'+data.name.replace("_"," ")+'</span></br>\
                <video autoplay></video>\
            </div>'
        );
	}
);

function send_message(){
    $('#chat_box').keydown(function(e){
        if (e.which == 13) {
            message = $('#chat_box').val();
            if (message !=="") {
                io.emit(
                    'updated_text',
                    {message: $('#chat_box').val()}
                );
                $(this).val('');
            }
        }
    });
}

io.on(
	'text_update',
	function(data){
		// console.log('i have a problem with ',data.text);
        $("#open_chat").append("<b>"+data.name+"</b>: "+data.text+"</br>");
        var elem = document.getElementById('open_chat');
        elem.scrollTop = elem.scrollHeight;
    }
);

io.on(
    'remove_user',
    function(data){
        $("#"+data.name+"").fadeOut(1000);
    }
);

App = {};
App.socket = io;

// Draw Function
App.draw = function(data) {
    if (data.type == "dragstart") {
        App.ctx.beginPath();
        App.ctx.moveTo(data.x,data.y);
    } else if (data.type == "drag") {
        App.ctx.lineTo(data.x,data.y);
        App.ctx.stroke();
    } else {
        App.ctx.stroke();
        App.ctx.closePath();
    }
};

// Draw from other sockets
App.socket.on('draw', App.draw) ;

// Bind click and drag events to drawing and sockets.
$(function() {
    App.ctx = $('canvas')[0].getContext("2d");
    $('canvas').on('drag dragstart dragend', function(e) {
        offset = $(this).offset();
        data = {
            x: (e.clientX - offset.left),
            y: (e.clientY - offset.top),
            type: e.handleObj.type
        };
        App.draw(data); // Draw yourself.
        App.socket.emit('drawClick', data); // Broadcast draw.
    });
});
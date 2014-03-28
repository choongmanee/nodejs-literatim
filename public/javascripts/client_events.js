io = io.connect();

var welcome = function() {
    var room = $('#room').val();
    var username = $('#user').val();
    console.log('Joining room:',room);
    console.log('Username:',username);

    if (room !== "") {
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
    'setup_new_teacher',
    function(data) {
        console.log('setup_new_teacher:', data.name);
        $('#teacher_options').append(
            "<label>Video:\
                <div>\
                    <button class='btn btn-xs btn-success' id='startButton'>Start</button>\
                    <button class='btn btn-xs btn-danger' id='hangupButton'>Stop</button>\
                </div>\
            </label>\
            <label>Text: \
                <div>\
                    <button class='btn btn-xs btn-success' id='openText'>Open</button>\
                    <button class='btn btn-xs btn-danger' id='closeText'>Close</button>\
                </div>\
            </label>\
            <label>Canvas: \
                <div>\
                    <button class='btn btn-xs btn-success' id='startCanvas'>Start</button>\
                    <button class='btn btn-xs btn-danger' id='stopCanvas'>Stop</button>\
                </div>\
            </label>"
        );
    }
);

io.on(
    'setup_new_user',
    function(data) {

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

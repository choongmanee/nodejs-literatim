io = io.connect();

var welcome = function() {
    var username = $('#user').val();
    var room = $('#roomname').val();
    console.log('username:',username);
    console.log('room:',room);

    if (username !== "") {
        io.emit(
            'got_a_new_user',
            {name: username,
            roomname: room}
        );
    } else {
        alert('Please enter a user name');
        location.reload();
    }
    $('header').append("Room Name:",room);
};

io.on(
    'setup_new_user',
    function(data) {

        // set up new user
        $('#first_user').text(data.name.replace("_"," "));
        $('#first_user').parent().attr('id',data.name);

        // show all users
        $.each(data.names,function(i,name){
            $('#container_row').append(
                '<div class="col-xs-6 col-sm-4 col-md-3 col-lg-3 users" id="'+name+'">\
                    <span class="glyphicon glyphicon-remove hideuser"></span>\
                    <h4 class="userheads">'+name.replace("_"," ")+'</h4>\
                    <div class="usertexts"></div>\
                </div>'
            );
        });

        $('.users').show("bounce",{ times: 3 },"slow");
    }
);

io.on(
    'add_newest_user',
    function(data) {
        console.log("has joined:",data.name);
        $('#container_row').append(
            '<div class="col-xs-6 col-sm-4 col-md-3 col-lg-3 users" id="'+data.name+'">\
                <span class="glyphicon glyphicon-remove hideuser"></span>\
                <h4 class="userheads">'+data.name.replace("_"," ")+'</h4>\
                <div class="usertexts"></div>\
            </div>'
        );
        $('#'+data.name).show("bounce",{ times: 3 },"slow");
    }
);

function send_message(){
        message = $('#message').val();
        io.emit(
            'updated_text',
            {message: message}
        );
    $('#message').keydown(function(e){
        if (e.which == 13) {
            $('#message').val('');
        }
    });
}

io.on(
    'text_update',
    function(data){
        // console.log('i have a problem with ',data.text);
        $("#"+data.name).find('.usertexts').text(data.text);
    }
);

io.on(
    'remove_user',
    function(data){
        console.log(data);
        $("#"+data.name).fadeOut(1000);
    }
);

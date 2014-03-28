io = io.connect();

var welcome = function() {
    var username = $('#user').val();
    console.log('Username:',username);

    if (username !== "") {
        io.emit(
            'got_a_new_user',
            {name: username}
        );
    } else {
        location.reload();
    }
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
                    <h4 class="userheads">'+name.replace("_"," ")+'</h4>\
                    <div class="usertexts"></div>\
                </div>'
            );
        });

        $('.users').show("bounce",{ times: 3 },"slow");
        document.title('literat.im['+data.count+']');
    }
);

io.on(
    'add_newest_user',
    function(data) {
        console.log(data.name);
        $('#container_row').append(
            '<div class="col-xs-6 col-sm-4 col-md-3 col-lg-3 users" id="'+data.name+'">\
                <h4 class="userheads">'+data.name.replace("_"," ")+'</h4></br>\
                <div class="usertexts"></div>\
            </div>'
        );
        $('#'+data.name).show("bounce",{ times: 3 },"slow");
    }
);

function send_message(){
    $('#message').keydown(function(e){
        message = $('#message').val();
        io.emit(
            'updated_text',
            {message: $('#message').val()}
        );
        if (e.which == 13) {
            $(this).val('');
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
        document.title('literat.im['+data.count+']');
    }
);

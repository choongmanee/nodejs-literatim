module.exports = function Routes (app) {
	app.get('/',function(req,res){
		res.render(
			'index'
		);
	});

var users = [];
var roomname;

	app.io.route(
		'got_a_new_user',
		function(req){
			var username = req.data.name.replace(" ","_");

			///// HANDLER FOR ROOM CHANGES
			if (roomname!==req.data.roomname) {
				users=[];
				list_length = app.io.sockets.clients(req.data.roomname).length;
				for ( i = 0; i < list_length; i++) {
				users.push(app.io.sockets.clients(req.data.roomname)[i].username);
				}
			}
			///// END HANDLER FOR ROOM CHANGES

			///// HANDLER FOR NEW USER ROOM NAME ASSIGNMENT
			roomname = req.data.roomname;
			req.io.join(roomname); // joins client to a specific roomname
			req.session.roomname = roomname;
			///// END HANDER FOR NEW USER ROOM NAME ASSIGNMENT

			///// LIST OF ALL CLIENTS PER ROOM
			var client_list = app.io.sockets.clients(roomname);
			list_length = client_list.length;
			///// END LIST

			req.socket.username = username; // sets the client's object attribute "username" as entered by client
			// console.log('app\n',app.io.sockets.sockets[socket.id].emit());

			req.io.room(roomname).broadcast(
				'add_newest_user',
				{name: username}
			);

			req.io.emit(
				'setup_new_user',
				{names: users,
				name: username}
			);
			users = [];
			for ( i = 0; i < list_length; i++) {
				users.push(client_list[i].username);
			}

			req.session.name = username; // set the client's session's name
			req.session.roomname = roomname; // sets the client's session roomname
		}
	);

	app.io.route(
		'updated_text',
		function(req){
			req.io.room(req.session.roomname).broadcast(
				'text_update',
				{text: req.data.message,
				name: req.session.name}
			);
		}
	);

	app.io.route('disconnect', function(req){
		var client_list = app.io.sockets.clients(req.session.roomname);
		var list_length = client_list.length;
		users=[];
		for (var i = 0; i < list_length; i++) {
				users.push(client_list[i].username);
			}
		var user = req.session.name;
		remove_index = users.indexOf(user);
		if (remove_index > -1) {
			users.splice(remove_index, 1);
		}
		console.log('disconnected:', user);
		
		app.io.room(req.session.roomname).broadcast(
			'remove_user',
			{name: user,
			count:users.length}
		);
	});

};
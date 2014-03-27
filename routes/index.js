module.exports = function Routes (app) {
	app.get('/',function(req,res){
		res.render(
			'index',
			{title: 'literat.im'}
		);
	});
	// app.get('/2',function(req,res){
	// 	res.render(
	// 		'index2'
	// 	);
	// });

var users = [];
var rooms = [];

	app.io.route(
		'got_a_new_user',
		function(req){
			// console.log(req.data);
			var room = req.data.room;
			req.session.room = room;
			req.io.join(room);
			console.log('number of users:');
			console.log(app.io.room(room).socket.manager.connected);
			var name = req.data.name.replace(" ","_");
			req.session.name = name;
			
			req.io.emit(
				'setup_new_user',
				{names: users,
				room: room,
				name: name}
			);

			users.push(name);
			// console.log('USERS:',users);

			req.io.room(room).broadcast(
				'add_newest_user',
				{name: name}
			);

		}
	);

	app.io.route(
		'updated_text',
		function(req){
			console.log('the req.data is',req.data);
			req.io.room(req.session.room).broadcast(
				'text_update',
				{text: req.data.message,
				name: req.session.name}
			);
		}
	);

	app.io.route('disconnect', function(req){
		console.log('the current user is',req.session.name);
		var index = users.indexOf(req.session.name);
		console.log('the index is:',index);
		console.log('the length of the array is ',users.length);
		if (users.length>0) {
			users.splice(index,1);
		}
		console.log('array users is',users);
		app.io.room(req.session.room).broadcast(
			'remove_user',
			{name: req.session.name}
		);
	});

// Broadcast all draw clicks.
app.io.route('drawClick', function(req) {
    req.io.broadcast('draw', req.data);
});

// Send client html.
app.get('/2', function(req, res) {
    res.sendfile(__dirname + '/index2.html');
});
	
};
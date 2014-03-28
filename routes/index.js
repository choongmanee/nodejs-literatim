module.exports = function Routes (app) {
	app.get('/',function(req,res){
		res.render(
			'index',
			{title: 'literat.im'}
		);
	});

var teacher = [];
var users = [];
var rooms = [];

	app.io.route(
		'got_a_new_user',
		function(req){
			var room = req.data.room;
			req.session.room = room;
			req.io.join(room);
			var name = req.data.name.replace(" ","_");
			req.session.name = name;

			if (teacher.length == 0) {
				teacher.push(name);
				console.log('TEACHER:', teacher);

				req.io.emit(
					'setup_new_teacher',
					{name: teacher,
					room: room,
					name: name}
				);
			}
			else if (users.length <= 6) {
				users.push(name);
				console.log('USERS:', users);

				req.io.room(room).broadcast(
					'add_newest_user',
					{name: name}
				);

				req.io.emit(
					'setup_new_user',
					{names: users,
					room: room,
					name: name}
				);
			}
			else {
				var message = "That room is currently full";
				req.io.emit(
					'full_room',
					{message: message}
				);
			}
		}
	);

	app.io.route(
		'updated_text',
		function(req){
			console.log('the req.data is',req.data);
			app.io.room(req.session.room).broadcast(
				'text_update',
				{text: req.data.message,
				name: req.session.name}
			);
		}
	);

	app.io.route('disconnect', function(req){
		console.log('the current user is',req.session.name);
		var index = users.indexOf(req.session.name);
		var user = req.session.name;
		console.log('the index is:',index);
		console.log('the length of the array is ',users.length);
		if (users.length>0) {
			users.splice(index,1);
		}
		if (teacher.indexOf(user) == 0) {
			teacher.splice(0, 1);
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
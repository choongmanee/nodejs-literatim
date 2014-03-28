module.exports = function Routes (app) {
	app.get('/',function(req,res){
		res.render(
			'index'
		);
	});

var users = [];

	app.io.route(
		'got_a_new_user',
		function(req){
			var name = req.data.name.replace(" ","_");
			req.session.name = name;


			console.log('USERS:', users);

			req.io.broadcast(
				'add_newest_user',
				{name: name,
				count: users.length+1}
			);

			req.io.emit(
				'setup_new_user',
				{names: users,
				name: name,
				count: users.length+1}
			);
			users.push(name);
		}
	);

	app.io.route(
		'updated_text',
		function(req){
			console.log('the req.data is',req.data);
			req.io.broadcast(
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
		console.log('array users is',users);
		console.log('disconnected:', user);
		
		app.io.broadcast(
			'remove_user',
			{name: user,
			count:users.length}
		);
	});

};
module.exports = function Routes (app) {
	app.get('/',function(req,res){
		res.render(
			'index',
			{title: 'real time chat'}
		);
	});
	app.get('/blueprint',function(req,res){
		res.render(
			'blueprint'
		);
	});

var users = [];

	app.io.route(
		'got_a_new_user',
		function(req){
			console.log(req.data);
			var name = req.data.name.replace(" ","_");
			req.session.name = name;
			
			req.io.emit(
				'new_user',
				{name: users}
			);

			users.push(name);
			req.io.broadcast(
				'newest_user',
				{name: name}
			);

			req.io.emit('setup_user',
				{name: name}
			);
		}
	);

	app.io.route(
		'updated_text',
		function(req){
			console.log(req.data);
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
		console.log('the index is:',index);
		console.log('the length of the array is ',users.length);
		users.splice(index,1);
		console.log('array users is',users);
		app.io.broadcast(
			'remove_user',
			{name: req.session.name}
		);
	});
	
};
var express = require('express.io');
var path = require('path');
var app = express().http().io();

//configuring the environment
app.configure(function(){
	app.use(express.cookieParser());
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(express.session({secret:'supawonk'}));
	app.set('view engine', 'ejs');
});

var route = require('./routes/index.js')(app);
app.listen(process.env.PORT || 5000);
console.log("PORT NUMBER: 5000");
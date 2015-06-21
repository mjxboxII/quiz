//*** modulo 9
//MW autorización de accesos HTTP restringidos

exports.loginRequired = function(req, res, next){
	
	if(req.session.user) {
		next(); 
	} else {
		res.redirect('/login');
	}
};

//GET /login
exports.new = function(req, res){//exports.new = function(req, res, p_ruta){

	var errors = req.session.errors || {};
	req.session.errors = {};

	res.render('sessions/new', { errors: errors });
};

//POST /login
exports.create = function(req, res){
	
	var login 		= req.body.login;
	var password 	= req.body.password;

	var userController = require('./user_controller');
	userController.autenticar(login, password, function(error, user){

		if (error) {
			req.session.errors = [{'message': 'Se ha producido un error: ' +error}];
			res.redirect('/login');
			return;
		}
		
		//Crear req.session.user y guardar campos id y username
		//La session se define por la existencia de 'req.session.user'
		//*** modulo 9 autologout
		var now = new Date();
		var nowSecs = (now.getMinutes()*60) + now.getSeconds();

		req.session.user = { id: user.id, username: user.username, doTime : nowSecs };
		res.redirect(req.session.redir.toString()); //redirección a path anterior a login
	});
};

//DELETE /logout --Destruir sesion
exports.destroy = function(req, res){
	delete req.session.user;
	res.redirect(req.session.redir.toString()); //redirect a path anterior a login
};

//*** modulo 9
//MW autorización de accesos HTTP restringidos
//** Mejora enrutamiento tras login

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
		
		if (req.session.redir.match(/\/quizes\/create/)){  //viene de llamar a post de crear pregunta
			//console.log('DE CREAR PREGUNTA');
			res.redirect('/quizes/new');  //redirige a creación de pregunta
		} else {
			if (req.session.redir.match(/\/quizes\/S\d+\/comments/)) {  //viene de la edicion de una pregunta
				var mydir = req.session.redir.toString();
				mydir = mydir.replace(/(\/quizes\/S\d+)(\/comments\/\d+)?/,'$1');
				//console.log("REEMPLAZO DE SHOW=" + mydir)
				res.redirect(mydir);
			} else {
				if (req.session.redir.match(/\/quizes\/\d+\/comments/)){  //viene de crear comentario
						//console.log('DE CREAR COMENTARIO');
						var mydir = req.session.redir.toString(); 
						res.redirect(mydir); 
				} else {
					if (req.session.redir.match(/\/quizes\/\d+\/edit/)){ //viene de hacer un post de editar pregunta
							//console.log('DE EDITAR PREGUNTA');
							var mydir = req.session.redir.toString();
							res.redirect(mydir);

					} else { 
						if (req.session.redir.match(/\/quizes\/\d+/)){ //viene de hacer un post de editar pregunta
							//console.log('DE EDITAR PREGUNTA');
							var mydir = req.session.redir.toString() + '/edit'
							res.redirect(mydir);
						} else {

							if(req.session.redir.match(/\/quizes\/D\d+/)){   //viene de borrar pregunta
							res.redirect('/quizes');
							} else {
								//console.log('DE CUALQUIER OTRO LADO');
								res.redirect(req.session.redir.toString());
							}
						}	
					}			
				}				
			}
		}
	});
};

//DELETE /logout --Destruir sesion
exports.destroy = function(req, res){
	delete req.session.user;
	//viene de llamar a post de crear/editar pregunta
	if ((req.session.redir.match(/\/quizes\/new/)) || (req.session.redir.match(/\/quizes\/\d+\/edit/))){  
			//console.log('DE CREAR PREGUNTA o de EDITAR PREGUNTA');
			res.redirect('/quizes');  //redirige a creación de pregunta
		} else {
			res.redirect(req.session.redir.toString()); 
	}//redirect a path anterior a login
};

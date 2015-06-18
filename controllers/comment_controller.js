//Importar modelo para acceder a la BBDD
var models = require('../models/models.js');

//*** modulo 9
//GET /quizes/:quizId/comments/new
exports.new = function(req, res){
	res.render('comments/new', { quizid: req.params.quizId, errors: []});
};

//*** modulo 9
//POST /quizes/:quizId/comments
exports.create = function(req, res){
	var comment = models.Comment.build( 
		{ texto: req.body.comment.texto, 
		  QuizId: req.params.quizId 
		});

	//Validacion modulo 8
	var errors = comment.validate();
	if (errors) {
		// comentado en foro
		var i=0; var errores=new Array();  //se convierte en [] con la propiedad message por compatibilida con layout
        for (var prop in errors) errores[i++]={message: errors[prop]}; 
		res.render('comments/new', {comment : comment, quizid: req.params.quizId, errors: errores});
	} else {
			//guarda en DB los campos pregunta y respuesta de quiz
		comment.save().then(function(){
		res.redirect('/quizes/' + req.params.quizId)}) //Redireccion HTTP (URL relativo) lista de preguntas
	}

};
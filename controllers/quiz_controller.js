//Importar modelo para acceder a la BBDD
var models = require('../models/models.js');

//GET /quizes/question
/****** modulo7 ************
exports.question=function(req,res){
	models.Quiz.findAll().success(function(quiz){
			res.render('quizes/question', {pregunta: 'Capital de Italia'});
	})	
};
***************************/
//Autoload ** modulo 7
exports.load = function (req, res, next, quizId) {
	// body...
	models.Quiz.find(quizId).then(
		function(quiz){
			if (quiz) {
				req.quiz = quiz;
				next();
			} else { next(new Error('No existe quizId=' + quizId));	}
		}
		).catch(function (error) { next(error); });
};

//GET /quizes ** modulo 7
exports.index= function(req, res){

	if (req.query.orige==1) { //Viene de busqueda
			if(req.query.b_opt=="preg"){ //busqueda por preg	
				var cadena = "%" + req.query.search1.replace(/[ ]+/g,"%") + "%";

				models.Quiz.findAll({where: ["pregunta like ?", cadena], order: "pregunta ASC"}).then(function(quizes){
					res.render('quizes/index', { quizes:quizes , orige : 1, errors: [] });
				}
				).catch (function(error) { next(error); });
			} else { //busqueda por tema
				models.Quiz.findAll({where: ["tematica = ?", req.query.search2], order: "pregunta ASC"}).then(function(quizes){
					res.render('quizes/index', { quizes:quizes , orige : 1, errors: [] });
				}
				).catch (function(error) { next(error); });
			};
	}
	else {
			models.Quiz.findAll().then(function(quizes){
				res.render('quizes/index', { quizes: quizes, orige: 0, errors: [] });
			}
			).catch (function(error) { next(error); });	
	}
}; 

//GET /quizes/:id ** modulo 7
exports.show = function(req,res){
	res.render('quizes/show', { quiz: req.quiz, errors: [] });	
}; 

//GET /quizes/:id/answer
exports.answer=function(req,res){
	var resultado = 'Incorrecto';

	var _miresp = req.query.respuesta.replace(/[ ]+/g," ");
		_miresp = _miresp.replace(/^[ ]+/g,'');
		_miresp = _miresp.replace(/[ ]+$/g,'');

	_miresp = _miresp.charAt(0).toUpperCase()+_miresp.slice(1);
	
	if (_miresp===req.quiz.respuesta){
		
			resultado= 'Correcto';
		}
		res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado, errors: [] });
};	

//*** modulo 8
//GET /quizes/new
exports.new = function(req, res){
	var quiz = models.Quiz.build(
			{pregunta: "Pregunta", respuesta: "Respuesta", tematica: "Temática"}
		);
	res.render('quizes/new', { quiz: quiz, errors: [], proc:0});
};

//*** modulo 8
//POST /quizes/create
exports.create = function(req, res){
	var quiz = models.Quiz.build( req.body.quiz	);
	//Validacion modulo 8
	var errors = quiz.validate();
	if (errors) {
		// comentado en foro
		var i=0; var errores=new Array();  //se convierte en [] con la propiedad message por compatibilida con layout
        for (var prop in errors) errores[i++]={message: errors[prop]}; 
		res.render('quizes/new', {quiz: quiz, errors: errores, proc:0});
	} else {
			//guarda en DB los campos pregunta y respuesta de quiz
		quiz.save({fields: ["pregunta", "respuesta", "tematica"]}).then(function(){
		res.redirect('/quizes')}) //Redireccion HTTP (URL relativo) lista de preguntas
	}

};

//GET /quizes/:id/edit
// *** modulo 8
exports.edit=function(req,res){
	var quiz = req.quiz; //autoload de instancia de quiz

	res.render('quizes/edit', { quiz: quiz, errors : [], proc:1});

};

//PUT /quizes/:id
exports.update = function(req, res){
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tematica = req.body.quiz.tematica;

	var errors = req.quiz.validate();
	if (errors) {
		// comentado en foro
		var i=0; var errores=new Array();  //se convierte en [] con la propiedad message por compatibilida con layout
        for (var prop in errors) errores[i++]={message: errors[prop]}; 
		res.render('quizes/edit', {quiz: req.quiz, errors: errores, proc:1});
	} else {
			//guarda en DB los campos pregunta y respuesta de quiz
		req.quiz.save({fields: ["pregunta", "respuesta", "tematica"]}).then(function(){
		res.redirect('/quizes')}) //Redireccion HTTP (URL relativo) lista de preguntas
	}
};

//DELETE /quizes/:id
exports.destroy = function(req, res){
	req.quiz.destroy().then(function(){ res.redirect('/quizes');}).catch(function(error){ next(error) });
};

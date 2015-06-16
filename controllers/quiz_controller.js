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
//GET /quizes
exports.index= function(req, res){
	models.Quiz.findAll().then(function(quizes){
		res.render('quizes/index.ejs', { quizes: quizes });
	})

};

//GET /quizes/:id
exports.show = function(req,res){
	models.Quiz.find(req.params.quizId).then(function(quiz){
			res.render('quizes/show', { quiz: quiz });
	})	
}; 

//GET /quizes/answer
exports.answer=function(req,res){

	var _miresp = req.query.respuesta.replace(/[ ]+/g," ");
		_miresp = _miresp.replace(/^[ ]+/g,'');
		_miresp = _miresp.replace(/[ ]+$/g,'');

	_miresp = _miresp.charAt(0).toUpperCase()+_miresp.slice(1);
	
	models.Quiz.find(req.params.quizId).then(function(quiz){
		if (_miresp===quiz.respuesta){
			res.render('quizes/answer', {quiz: quiz, respuesta: 'Correcto'});
		} else {
			res.render('quizes/answer', {quiz:quiz, respuesta: 'Incorrecto'});
		}
	})
};

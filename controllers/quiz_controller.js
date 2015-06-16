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
//GET /quizes?search ** modulo 7
exports.index= function(req, res){
	var cadena = req.query.search.replace(/[ ]+/g,"%");
	cadena = "%" + cadena + "%";

	models.Quiz.findAll({where: ["pregunta like ?", cadena], order: "pregunta ASC"}).then(function(quizes){
		res.render('quizes/index.ejs', { quizes: quizes });
	}
	).catch (function(error) { next(error); });

}; 

//GET /quizes/:id ** modulo 7
exports.show = function(req,res){
	res.render('quizes/show', { quiz: req.quiz });	
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
		res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado });
};	

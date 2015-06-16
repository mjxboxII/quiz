//Importar modelo para acceder a la BBDD
var models = require('../models/models.js');

//GET /quizes/question
exports.question=function(req,res){
	models.Quiz.findAll().success(function(quiz){
			res.render('quizes/question', {pregunta: 'Capital de Italia'});
	})	
};

//GET /quizes/answer
exports.answer=function(req,res){

	var _miresp = req.query.respuesta.replace(/[ ]+/g," ");
		_miresp = _miresp.replace(/^[ ]+/g,'');
		_miresp = _miresp.replace(/[ ]+$/g,'');

	_miresp = _miresp.charAt(0).toUpperCase()+_miresp.slice(1);
	
	models.Quiz.findAll().success(function(quiz){
		if (_miresp===quiz[0].respuesta){
			res.render('quizes/answer', {respuesta: 'Correcto'});
		} else {
			res.render('quizes/answer', {respuesta: 'Incorrecto'});
		}
	})
};

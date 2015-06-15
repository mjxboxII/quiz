//GET /quizes/question
exports.question=function(req,res){
	res.render('quizes/question', {pregunta: 'Capital de Italia'});
};

//GET /quizes/answer
exports.answer=function(req,res){
	
	var patt = /^Roma$/i;
	var _miresp = req.query.respuesta.replace(/[ ]+/g," ");
		_miresp = _miresp.replace(/^[ ]+/g,'');
		_miresp = _miresp.replace(/[ ]+$/g,'');

	_miresp = _miresp.charAt(0).toUpperCase()+_miresp.slice(1);
	
	if (patt.test(_miresp)){
		res.render('quizes/answer', {respuesta: 'Correcto'});
	} else {
		res.render('quizes/answer', {respuesta: 'Incorrecto'});
	}
};

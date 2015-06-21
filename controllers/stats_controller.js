//Importar modelo para acceder a la BBDD
var models = require('../models/models.js');

//GET /quizes/statistics *** Estadísticas módulo 9
exports.analyze= function(req, res){
	var datos = { np: 0, nc: 0, avg: 0.0, pcc: 0, psc: 0 };

	models.Quiz.findAll().then(function(pregs){	 // Todas las Preguntas
		console.log('Preguntas=' +pregs.length);
		datos.np = pregs.length; //Total pregs

		var lpre = [];
		pregs.forEach(function (ques) {
			lpre.push(ques.id); 
		});
		
		models.Comment.findAll({   // Todos los Comentarios (con pregunta asociada: pq al no crear onDelete:CASCADE) 
								   // qeda basura en Comments --> Comentarios para preguntas inexistentes (borradas)  
			   where : { QuizId : {in : lpre} } 
			}).then(function(comms){
	 			datos.nc = comms.length; //Total comments
				datos.avg = parseFloat(datos.nc / datos.np).toFixed(2);

				var lcom = [];
				comms.forEach(function (comi) {
					lcom.push(comi.QuizId); 
				});

				models.Quiz.findAll({ where :{ id: {in : lcom} } }). 	//Preguntas CON comments		 
						then(function(pregsCC){
	 						datos.pcc = pregsCC.length; 
	 						
	 						datos.psc = datos.np - datos.pcc; //Preguntas SIN Comentarios

	 			res.render('quizes/statistics', { datos: datos , errors: []});
	 		});

	 	});
	});
}; 


var express = require('express');
var router = express.Router();

//paso4: primera pagina
var quizController 		= require('../controllers/quiz_controller');
var commentController 	= require('../controllers/comment_controller'); //*** mod 9
var sessionController 	= require('../controllers/session_controller');
var statsController 	= require('../controllers/stats_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: [] });
});

//Autoload de comandos con :quizId **modulo 7
router.param('quizId', quizController.load);  //Autoload :quizId
router.param('commentId', commentController.load); //autoload :commentId

//Definicion de rutas de /quizes **modulo 7
router.get('/quizes', 						quizController.index);
router.get('/quizes/:quizId(\\d+)', 		quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', 	quizController.answer);
//*** mod 8
router.get('/quizes/new', 					sessionController.loginRequired, quizController.new);
router.post('/quizes/create', 				sessionController.loginRequired, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit', 	sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)', 		sessionController.loginRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)', 		sessionController.loginRequired, quizController.destroy);
//*** mod 9
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', 	 commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', 	 sessionController.loginRequired, commentController.publish);
router.delete('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)', sessionController.loginRequired, commentController.destroy);

//Definicion de rutas de sesion *** modulo 9
router.get('/login',					sessionController.new); //formulario login
router.post('/login', 					sessionController.create); //crear sesion
router.get('/logout',					sessionController.destroy); //destruir sesion ->>DEBERÍA ser DELETE

//Estadísticas *** modulo 9
router.get('/quizes/statistics', 		statsController.analyze);

router.get('/author', function(req, res) {
  res.render('author', {errors: []});
});


module.exports = router;

var express = require('express');
var router = express.Router();

//paso4: primera pagina
var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

//Autoload de comandos con :quizId **modulo 7
router.param('quizId', quizController.load);  //Autoload :quizId

//Definicion de rutas de /quizes **modulo 7
router.get('/quizes', 						quizController.index);
router.get('/quizes/:quizId(\\d+)', 		quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', 	quizController.answer);

router.get('/author', function(req, res) {
  res.render('author');
});

module.exports = router;

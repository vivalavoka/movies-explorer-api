const { Router } = require('express');
const { celebrate } = require('celebrate');

const auth = require('../middlewares/auth');
const { saveMovieSchema, removeMovieSchema } = require('../schemas/movies');

const {
  getMovies,
  removeMovie,
  saveMovie,
} = require('../controllers/movies');

const router = Router();

router.get('/movies', auth, getMovies);
router.post('/movies', auth, celebrate(saveMovieSchema), saveMovie);
router.delete('/movies/:movieId', auth, celebrate(removeMovieSchema), removeMovie);

module.exports = router;

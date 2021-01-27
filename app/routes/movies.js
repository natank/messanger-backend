import express from 'express';

// import { isLoggedIn as isAuth } from '../BL/middleware/is-auth';
import * as moviesController from '../BL/movies';
import { isAuth } from '../BL/middleware/auth';

const router = express.Router();

router.get('/', isAuth, moviesController.findMovies);
router.get('/delete/:id', isAuth, moviesController.deleteMovie);
router.get('/create', isAuth, moviesController.getMovie);
router.get('/:id', isAuth, moviesController.getMovie);

router.post('/', isAuth, moviesController.postCreateMovie);
router.put('/:id', isAuth, moviesController.updateMovie);

export default router;

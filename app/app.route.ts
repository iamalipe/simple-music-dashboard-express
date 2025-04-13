import express from 'express';

import authRouter from './auth/auth.route';
import artistRouter from './artist/artist.route';
import songRouter from './song/song.route';
import albumRouter from './album/album.route';
import playlistRouter from './playlist/playlist.route';
import genreRouter from './genre/genre.route';
import { jwtAuth } from '../middlewares/jwtAuth.middlewares';

const appRouter = express.Router();

appRouter.use('/auth', authRouter);
appRouter.use('/artist', jwtAuth, artistRouter);
appRouter.use('/song', jwtAuth, songRouter);
appRouter.use('/album', jwtAuth, albumRouter);
appRouter.use('/playlist', jwtAuth, playlistRouter);
appRouter.use('/genre', jwtAuth, genreRouter);

export default appRouter;

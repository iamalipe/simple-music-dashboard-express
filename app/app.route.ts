import express from 'express';
import artistRouter from './artist/artist.route';
import songRouter from './song/song.route';
import albumRouter from './album/album.route';
import playlistRouter from './playlist/playlist.route';
import genreRouter from './genre/genre.route';

const appRouter = express.Router();

appRouter.use('/artist', artistRouter);
appRouter.use('/song', songRouter);
appRouter.use('/album', albumRouter);
appRouter.use('/playlist', playlistRouter);
appRouter.use('/genre', genreRouter);

export default appRouter;

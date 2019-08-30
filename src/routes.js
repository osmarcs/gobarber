import { Router } from 'express';
import multer from 'multer';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import AuthMiddleware from './app/middlewares/auth';
import multerConfig from './config/multer';

const upload = multer(multerConfig);
const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

routes.use(AuthMiddleware);
routes.put('/users', UserController.update);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;

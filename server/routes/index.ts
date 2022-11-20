import Router from 'express-promise-router';

import admin from './admin';
import app from './app';
import auth from './auth';
import interactions from './interactions';


const router = Router();
export default router;

router.use('/admin', admin);
router.use('/app', app);
router.use('/auth', auth);
router.use('/interactions', interactions);

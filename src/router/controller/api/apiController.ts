import { Router } from 'express';

import healthController from '../healthcheck/healthController';
import userController from '../user/userController';

const router: Router = Router();

router.use('/health', healthController);
router.use('/user', userController);

export default router;

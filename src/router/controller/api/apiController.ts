import { Router } from 'express';

import healthController from '../healthcheck/healthController';

const router: Router = Router();

router.use('/', healthController);

export default router;

import { Router } from 'express';

import { HealthCheck } from '../../middleware/healthcheck/healthMiddleware';

const router: Router = Router();

const health = new HealthCheck();

router.get('/health', health.get);

export default router;

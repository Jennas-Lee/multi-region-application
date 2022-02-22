import { Router } from 'express';

import { UserCrud } from '../../middleware/user/userCrudMiddleware';

const router: Router = Router();

const userCrud = new UserCrud();

router.get('/', userCrud.get);
router.post('/', userCrud.post);
router.put('/', userCrud.put);
router.delete('/', userCrud.delete);

export default router;

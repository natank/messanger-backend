import express from 'express';

// import { isLoggedIn as isAuth } from '../BL/middleware/is-auth';
import * as membersController from '../BL/members';
import { isAuth } from '../BL/middleware/auth';
const router = express.Router();

router.get('/', isAuth, membersController.getMembers);
router.get('/create', isAuth, membersController.getMember);

router.get('/:id', isAuth, membersController.getMember);
router.post('/', isAuth, membersController.postCreateMember);
router.delete('/:id', isAuth, membersController.getDeleteMember);
router.put('/:id', isAuth, membersController.postUpdateMember);

export default router;

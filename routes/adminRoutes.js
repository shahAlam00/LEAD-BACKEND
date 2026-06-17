import express from 'express';
const router = express.Router();

import { 
  createAdmin, 
  getAdmins, 
  updateAdmin, 
  deleteAdmin, 
  suspendAdmin 
} from '../controllers/adminController.js'; 

router.post("/create",  createAdmin);
router.get("/get-admins",  getAdmins);
router.patch("/edit-admin/admins/:id",  updateAdmin);
router.delete("/delete-admin/admins/:id",  deleteAdmin);
router.patch("/sus-admin/admins/:id/suspend",  suspendAdmin);

export default router;
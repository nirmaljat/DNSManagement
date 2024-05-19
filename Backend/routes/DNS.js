import  express  from "express";
import { bulk, deleteDNS, getMyDNS, newDNS, updateMyDNS } from "../controler/DNS.js";
import { isAuthenticated } from "../middleware/auth.js";

const router=express.Router();

router.post("/new",isAuthenticated,newDNS)
router.get("/my",isAuthenticated,getMyDNS)
router.post("/bulk",isAuthenticated,bulk)
router.route("/:id").post(updateMyDNS).delete(deleteDNS)

export default router;
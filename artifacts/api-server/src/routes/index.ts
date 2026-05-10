import { Router, type IRouter } from "express";
import healthRouter from "./health";
import productsRouter from "./products";
import bundlesRouter from "./bundles";
import settingsRouter from "./settings";
import analyticsRouter from "./analytics";
import firebaseTokenRouter from "./firebaseToken";

const router: IRouter = Router();

router.use(healthRouter);
router.use(productsRouter);
router.use(bundlesRouter);
router.use(settingsRouter);
router.use(analyticsRouter);
router.use(firebaseTokenRouter);

export default router;

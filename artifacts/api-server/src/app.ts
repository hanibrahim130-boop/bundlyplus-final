import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { clerkMiddleware } from "@clerk/express";
import { publishableKeyFromHost } from "@clerk/shared/keys";
import {
  CLERK_PROXY_PATH,
  clerkProxyMiddleware,
  getClerkProxyHost,
} from "./middlewares/clerkProxyMiddleware";
import router from "./routes";
import { logger } from "./lib/logger";
import { linkHeaders } from "./middlewares/linkHeaders";
import { markdownNegotiation } from "./middlewares/markdownNegotiation";
import apiCatalogRouter from "./routes/apiCatalog";
import oauthDiscoveryRouter from "./routes/oauthDiscovery";
import mcpServerCardRouter from "./routes/mcpServerCard";
import agentSkillsRouter from "./routes/agentSkills";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());

app.use(linkHeaders);
app.use(markdownNegotiation);
app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  clerkMiddleware((req) => ({
    publishableKey: publishableKeyFromHost(
      getClerkProxyHost(req) ?? "",
      process.env.CLERK_PUBLISHABLE_KEY,
    ),
  })),
);

app.use(apiCatalogRouter);
app.use(oauthDiscoveryRouter);
app.use(mcpServerCardRouter);
app.use(agentSkillsRouter);
app.use("/api", router);

export default app;

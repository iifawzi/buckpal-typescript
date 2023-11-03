import express, { NextFunction, Request, Response } from "express";
import { injectable } from "tsyringe";
import { BaseApp } from "interfaces";
import { container } from "tsyringe";
import { SendMoneyController } from "@/account/adapter/in/web/controllers/SendMoneyController";
@injectable()
export default class App implements BaseApp {
  private instance: express.Application;
  constructor() {
    this.instance = this.loadServer();
    this.configureApp();
  }

  private loadServer(): express.Application {
    const expressApp = express();
    return expressApp;
  }

  private configureApp() {
    // Routes and parsing configurations
    this.ConfigureRoutes();
    this.LoadRoutes();
    // Global error handling:
    this.instance.use(
      (err: Error, _: Request, res: Response, next: NextFunction) => {
        console.error(err);
        res.status(500).json({
          status: 500,
          message: err.message,
        });
      }
    );
  }

  private ConfigureRoutes() {
    this.instance.use(express.json());
    this.instance.use((req: Request, res: Response, next: NextFunction) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader(
        "Access-Control-Allow-Methods",
        "OPTIONS, GET, POST, PATCH"
      );
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, X-Requested-With"
      );
      next();
    });
  }

  private LoadRoutes() {
    const router = express.Router();
    const sendMoneyController =
      container.resolve<SendMoneyController>(SendMoneyController);

    // Routes
    router.get("/", (req, res, next) => {
      res.json({
        message: "Working!",
      });
    });
    router.post("/account/sendMoney", sendMoneyController.sendMoney.bind(sendMoneyController));
    this.instance.use(router);
  }

  public get getInstance(): express.Application {
    return this.instance;
  }
}

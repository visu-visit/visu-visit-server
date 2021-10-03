import express from "express";
import { uploadHistoryFile } from "../middlewares";
import {
  getBrowserHistory,
  saveBrowserHistory,
  deleteBrowserHistory,
} from "../controllers/browserHistoryController";

const browserHistoryRouter = express.Router();

browserHistoryRouter
  .route("/:browser_history_id")
  .get(getBrowserHistory)
  .post(uploadHistoryFile, saveBrowserHistory)
  .delete(deleteBrowserHistory);

export default browserHistoryRouter;

import express from "express";
import { uploadHistoryFile, validateBrowserHistoryId } from "../middlewares";
import {
  getBrowserHistory,
  saveBrowserHistory,
  deleteBrowserHistory,
} from "../controllers/browserHistoryController";

const browserHistoryRouter = express.Router();

browserHistoryRouter
  .route("/:browser_history_id")
  .all(validateBrowserHistoryId)
  .get(getBrowserHistory)
  .post(uploadHistoryFile, saveBrowserHistory)
  .delete(deleteBrowserHistory);

export default browserHistoryRouter;

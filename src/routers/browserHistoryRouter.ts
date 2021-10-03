import express from "express";
import {
  modifyBrowserHistory,
  getBrowserHistory,
  saveBrowserHistory,
  deleteBrowserHistory,
} from "../controllers/browserHistoryController";
import {
  uploadHistoryFile,
  validateBrowserHistory,
  validateBrowserHistoryId,
  validateBrowserHistoryQueries,
} from "../middlewares";

const browserHistoryRouter = express.Router();

browserHistoryRouter
  .route("/:browser_history_id")
  .all(validateBrowserHistoryId)
  .get(validateBrowserHistoryQueries, getBrowserHistory)
  .post(uploadHistoryFile, saveBrowserHistory)
  .put(validateBrowserHistory, modifyBrowserHistory)
  .delete(deleteBrowserHistory);

export default browserHistoryRouter;

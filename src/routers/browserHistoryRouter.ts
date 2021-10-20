import express from "express";
import {
  convertHistoryFile,
  saveOrUpdateBrowserHistory,
  getBrowserHistory,
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
  .post(uploadHistoryFile, convertHistoryFile)
  .put(validateBrowserHistory, saveOrUpdateBrowserHistory)
  .delete(deleteBrowserHistory);

export default browserHistoryRouter;

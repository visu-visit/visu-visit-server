import express from "express";
import {
  getBrowserHistory,
  saveBrowserHistory,
  deleteBrowserHistory,
} from "../controllers/browserHistoryController";

const browserHistoryRouter = express.Router();

browserHistoryRouter
  .route("/:browser_history_id")
  .get(getBrowserHistory)
  .post(saveBrowserHistory)
  .delete(deleteBrowserHistory);

export default browserHistoryRouter;

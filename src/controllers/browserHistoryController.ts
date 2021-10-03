import { NextFunction, Request, Response } from "express";
import fs from "fs";
import { IDomainNode, IBrowserHistory } from "../types/history.type";
import extractDomainNodesFromVisits from "../utils/history/extractDomainNodesFromVisits";
import { getVisitData } from "../sqlite3/index";
import ERROR from "../constants/errorMessage";
import createError from "../utils/createError";
import BrowserHistory from "../models/BrowserHistory";

export const saveBrowserHistory = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { browser_history_id: browserHistoryId } = req.params;

  try {
    const totalVisits = await getVisitData();
    const domainNodes: IDomainNode[] =
      extractDomainNodesFromVisits(totalVisits);

    const browserHistory: IBrowserHistory = {
      nanoId: browserHistoryId,
      totalVisits,
      domainNodes,
    };

    await BrowserHistory.create(browserHistory);

    res.json({ result: "ok", data: browserHistory });
  } catch (error) {
    res.status(500).json(createError(2000, ERROR.HISTORY_PROCESS));
  } finally {
    fs.unlinkSync("src/tempHistory/History.db");
  }
};

export const getBrowserHistory = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {};

export const deleteBrowserHistory = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {};

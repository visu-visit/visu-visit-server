import fs from "fs";
import { Request, Response } from "express";
import {
  IVisit,
  IBrowserHistory,
  IDomainNode,
  IBrowserHistoryQuery,
} from "../types/history.type";

import BrowserHistory from "../models/BrowserHistory";
import extractDomainNodesFromVisits from "../utils/history/extractDomainNodesFromVisits";
import createError from "../utils/createError";
import { getVisitData } from "../sqlite3/index";
import ERROR from "../constants/errorMessage";

export const saveBrowserHistory = async (
  req: Request,
  res: Response,
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

export const getBrowserHistory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { browser_history_id: browserHistoryId } = req.params;
  const { start, end, domain }: IBrowserHistoryQuery = req.query;

  const browserHistory: IBrowserHistory = await BrowserHistory.findOne({
    nanoId: browserHistoryId,
  }).lean();

  if (!browserHistory) {
    res.status(500).json(createError(2007, ERROR.HISTORY_PROCESS));
    return;
  }

  const ONE_DAY = 1000 * 60 * 60 * 24;
  const { domainNodes, totalVisits } = browserHistory;
  let filteredDomainNodes: IDomainNode[] = domainNodes;
  let filteredVisits: IVisit[] = totalVisits;

  if (start && end) {
    filteredVisits = totalVisits.filter(
      ({ visitTime }) =>
        new Date(start) <= new Date(visitTime) &&
        new Date(visitTime) < new Date(new Date(end).getTime() + ONE_DAY),
    );

    filteredDomainNodes = extractDomainNodesFromVisits(filteredVisits);
  }

  if (domain) {
    filteredVisits = filteredVisits.filter(({ visitUrl }) =>
      new URL(visitUrl).origin.includes(domain),
    );

    filteredDomainNodes = filteredDomainNodes.filter(
      ({ domainName }: IDomainNode) => domainName.includes(domain),
    );
  }

  res.json({
    result: "ok",
    data: {
      nanoId: browserHistoryId,
      totalVisits: filteredVisits,
      domainNodes: filteredDomainNodes,
    },
  });
};

export const modifyBrowserHistory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { browser_history_id: browserHistoryId } = req.params;
  const browserHistory: IBrowserHistory = req.body;

  try {
    await BrowserHistory.updateOne(
      { nanoId: browserHistoryId },
      { ...browserHistory },
    );

    res.json({ result: "ok" });
  } catch (error) {
    res.status(500).json(createError(2004, ERROR.HISTORY_PROCESS));
  }
};

export const deleteBrowserHistory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { browser_history_id: browserHistoryId } = req.params;

  try {
    const { deletedCount } = await BrowserHistory.deleteOne({
      nanoId: browserHistoryId,
    });

    if (deletedCount === 0) {
      res.status(400).json(createError(2002, ERROR.HISTORY_ID_NOT_EXIST));
      return;
    }

    res.json({ result: "ok" });
  } catch (error) {
    res.status(500).json(createError(2001, ERROR.HISTORY_DELETE));
  }
};

import fs from "fs";
import { Request, Response } from "express";
import { getVisitData } from "../sqlite3/index";

import { IVisit, IBrowserHistory, IBrowserHistoryQuery } from "../types/history.type";
import BrowserHistory from "../models/BrowserHistory";
import updateDomainNodesFromVisits from "../utils/history/updateDomainNodesFromVisits";
import extractDomainNodesFromVisits from "../utils/history/extractDomainNodesFromVisits";
import createError from "../utils/createError";
import ERROR from "../constants/errorMessage";

export const saveBrowserHistory = async (req: Request, res: Response): Promise<void> => {
  const { browser_history_id: browserHistoryId } = req.params;

  try {
    const totalVisits = await getVisitData();

    const domainNodes = extractDomainNodesFromVisits(totalVisits);

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

export const getBrowserHistory = async (req: Request, res: Response): Promise<void> => {
  const { browser_history_id: browserHistoryId } = req.params;
  const { start, end, domain }: IBrowserHistoryQuery = req.query;
  const ONE_DAY = 1000 * 60 * 60 * 24;
  const UTC_SEOUL_HOUR_DIFFERENCE = 1000 * 60 * 60 * 9;

  try {
    const browserHistory: IBrowserHistory = await BrowserHistory.findOne({
      nanoId: browserHistoryId,
    }).lean();

    if (!browserHistory) {
      res.status(500).json(createError(2007, ERROR.HISTORY_PROCESS));
      return;
    }

    const { domainNodes, totalVisits } = browserHistory;
    let filteredVisits: IVisit[] = totalVisits;

    if (start && end) {
      filteredVisits = totalVisits.filter(
        ({ visitTime }) =>
          new Date(start).getTime() <= new Date(visitTime).getTime() + UTC_SEOUL_HOUR_DIFFERENCE &&
          new Date(visitTime).getTime() + UTC_SEOUL_HOUR_DIFFERENCE <
            new Date(end).getTime() + ONE_DAY,
      );
    }

    if (domain) {
      filteredVisits = filteredVisits.filter(
        ({ targetUrl, sourceUrl }) =>
          new URL(targetUrl).origin.includes(domain) ||
          (sourceUrl && new URL(sourceUrl).origin.includes(domain)),
      );
    }

    const updatedDomainNodes = updateDomainNodesFromVisits(filteredVisits, domainNodes);

    res.json({
      result: "ok",
      data: {
        nanoId: browserHistoryId,
        totalVisits: filteredVisits,
        domainNodes: updatedDomainNodes,
      },
    });
  } catch (error) {
    res.status(500).json(createError(2000, ERROR.INTERNAL_SERVER));
  }
};

export const modifyBrowserHistory = async (req: Request, res: Response): Promise<void> => {
  const { browser_history_id: browserHistoryId } = req.params;
  const browserHistory: IBrowserHistory = req.body;

  try {
    if (!browserHistory) {
      res.status(500).json(createError(2007, ERROR.HISTORY_PROCESS));
      return;
    }

    const result = await BrowserHistory.findOneAndUpdate(
      { nanoId: browserHistoryId },
      { ...browserHistory },
    );

    if (!result) {
      res.status(500).json(createError(2007, ERROR.HISTORY_ID_NOT_EXIST));
      return;
    }

    res.json({ result: "ok" });
  } catch (error) {
    res.status(500).json(createError(2004, ERROR.HISTORY_PROCESS));
  }
};

export const deleteBrowserHistory = async (req: Request, res: Response): Promise<void> => {
  const { browser_history_id: browserHistoryId } = req.params;

  try {
    const { deletedCount } = await BrowserHistory.deleteOne({
      nanoId: browserHistoryId,
    });

    if (deletedCount === 0) {
      res.status(400).json(createError(2007, ERROR.HISTORY_ID_NOT_EXIST));
      return;
    }

    res.json({ result: "ok" });
  } catch (error) {
    res.status(500).json(createError(2001, ERROR.HISTORY_DELETE));
  }
};

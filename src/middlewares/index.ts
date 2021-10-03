import { NextFunction, Request, Response } from "express";
import validator from "validator";
import multer from "multer";

import {
  IDomainNode,
  IBrowserHistory,
  IVisit,
  IBrowserHistoryQuery,
} from "../types/history.type";
import ERROR from "../constants/errorMessage";
import createError from "../utils/createError";

const upload = multer({
  storage: multer.diskStorage({
    destination: "src/tempHistory/",
    filename: (req, file, callback) => {
      callback(null, "History.db");
    },
  }),
});

export const uploadHistoryFile = upload.single("historyFile");

export const validateBrowserHistoryId = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { browser_history_id: browserHistoryId } = req.params;

  if (typeof browserHistoryId !== "string") {
    res.status(400).json(createError(2002, ERROR.INVALID_HISTORY_ID));
    return;
  }

  next();
};

const isDomainNode = (data: any): data is IDomainNode =>
  data.domainName !== undefined &&
  data.nanoId !== undefined &&
  data.position !== undefined &&
  data.position.x !== undefined &&
  data.position.y !== undefined;

const isVisit = (data: any): data is IVisit =>
  data.visitId !== undefined &&
  data.visitTime !== undefined &&
  data.visitUrl !== undefined &&
  data.urlVisitCount !== undefined &&
  data.visitDuration !== undefined &&
  data.lastVisitTime !== undefined &&
  data.transition !== undefined &&
  data.fromVisitId !== undefined;

const isBrowserHistory = (data: any): data is IBrowserHistory => {
  if (typeof data !== "object") {
    return false;
  }

  if (
    data.nanoId === undefined ||
    data.totalVisits === undefined ||
    data.domainNodes === undefined
  ) {
    return false;
  }

  if (!Array.isArray(data.totalVisits) || !Array.isArray(data.domainNodes)) {
    return false;
  }

  for (let i = 0; i < data.totalVisits.length; i += 1) {
    if (!isVisit(data.totalVisits[i])) {
      return false;
    }
  }

  for (let i = 0; i < data.domainNodes.length; i += 1) {
    if (!isDomainNode(data.domainNodes[i])) {
      return false;
    }
  }

  return true;
};

export const validateBrowserHistory = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (isBrowserHistory(req.body)) {
    next();
    return;
  }

  res.status(400).json(createError(2003, ERROR.INVALID_HISTORY_FORMAT));
};

export const validateBrowserHistoryQueries = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { start, end, domain }: IBrowserHistoryQuery = req.query;

  if (domain && typeof domain !== "string") {
    res.status(400).json(createError(2006, ERROR.INVALID_HISTORY_QUERY));
    return;
  }

  if (!start && !end) {
    next();
    return;
  }

  if (
    !start ||
    !end ||
    typeof start !== "string" ||
    typeof end !== "string" ||
    !validator.isDate(start) ||
    !validator.isDate(end)
  ) {
    res.status(400).json(createError(2005, ERROR.INVALID_HISTORY_QUERY));
    return;
  }

  next();
};

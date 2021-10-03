import { NextFunction, Request, Response } from "express";
import multer from "multer";
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

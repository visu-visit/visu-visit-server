/* eslint-disable import/prefer-default-export */

import multer from "multer";

const upload = multer({
  storage: multer.diskStorage({
    destination: "src/tempHistory/",
    filename: (req, file, callback) => {
      callback(null, "History.db");
    },
  }),
});

export const uploadHistoryFile = upload.single("historyFile");

import mongoose from "mongoose";
import validator from "validator";

const visitSchema = new mongoose.Schema({
  visitId: { type: Number, required: true },
  visitTime: { type: String, required: true },
  visitUrl: {
    type: String,
    required: {
      validate: {
        validator: (url: any) => validator.isURL(String(url)),
      },
    },
  },
  urlVisitCount: { type: Number, required: true },
  visitTitle: { type: String, default: "" },
  visitDuration: { type: Number, required: true, default: 0 },
  lastVisitTime: { type: String, required: true },
  transition: {
    type: String,
    enum: [
      "Link",
      "Typed",
      "Auto_Bookmark",
      "Auto_Subframe",
      "Manual_Subframe",
      "Generated",
      "Auto_Toplevel",
      "Form_Submit",
      "Reload",
      "Keyword",
      "Keyword_Generated",
    ],
  },
  fromVisitId: { type: Number },
  fromVisitUrl: { type: String },
  fromVisitTime: { type: String },
  fromVisitTitle: { type: String },
});

const domainNodeSchema = new mongoose.Schema({
  nanoId: { type: String, unique: true },
  domainName: { type: String, unique: true, minLength: 1, maxLength: 200 },
  position: { x: Number, y: Number },
});

const browserHistorySchema = new mongoose.Schema({
  nanoId: { type: String, unique: true },
  totalVisits: [visitSchema],
  domainNodes: [domainNodeSchema],
});

const BrowserHistory = mongoose.model("BrowserHistory", browserHistorySchema);

export default BrowserHistory;

import mongoose from "mongoose";
import validator from "validator";

const visitSchema = new mongoose.Schema({
  visitId: { type: Number, required: true },
  visitTime: { type: Date, required: true },
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
  lastVisitTime: { type: Date, required: true },
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
  fromVisitTime: { type: Date },
  fromVisitTitle: { type: String },
});

const domainNodeSchema = new mongoose.Schema({
  nanoId: { type: String },
  domainName: { type: String, minLength: 1, maxLength: 200 },
  position: { x: Number, y: Number },
});

const browserHistorySchema = new mongoose.Schema({
  nanoId: { type: String },
  totalVisits: [visitSchema],
  domainNodes: [domainNodeSchema],
});

const BrowserHistory = mongoose.model("BrowserHistory", browserHistorySchema);

export default BrowserHistory;

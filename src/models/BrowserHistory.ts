import mongoose from "mongoose";

import { URL_TRANSITION_TYPE } from "../constants/index";

const visitSchema = new mongoose.Schema({
  visitId: { type: Number, required: true },
  visitTime: { type: Date, required: true },
  targetUrl: { type: String, minLength: 1, maxLength: 2048, required: true },
  targetUrlVisitCount: { type: Number, required: true, default: 1 },
  visitDuration: { type: Number, required: true, default: 0 },
  transitionType: {
    type: String,
    enum: URL_TRANSITION_TYPE,
    required: true,
    default: "Link",
  },
  sourceUrl: { type: String, minLength: 1, maxLength: 2048 },
  sourceUrlVisitCount: { type: Number, default: 1 },
});

const domainNodeSchema = new mongoose.Schema({
  name: { type: String, minLength: 1, maxLength: 2048, required: true },
  visitCount: { type: Number, default: 0, required: true },
  visitDuration: { type: Number, default: 0, required: true },
  lastVisitTime: { type: Date, required: true },
  index: Number,
  x: Number,
  y: Number,
  fx: Number,
  fy: Number,
  vx: Number,
  vy: Number,
});

const browserHistorySchema = new mongoose.Schema({
  nanoId: { type: String, required: true },
  totalVisits: [visitSchema],
  domainNodes: [domainNodeSchema],
});

const BrowserHistory = mongoose.model("BrowserHistory", browserHistorySchema);

export default BrowserHistory;

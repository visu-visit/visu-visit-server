import sqlite3 from "sqlite3";
import { IVisit } from "../types/history.type";
/* eslint-disable import/prefer-default-export */

sqlite3.verbose();

const QUERY_VISIT_DATA = `
  SELECT
  visits.id AS visitId,
  datetime((visits.visit_time / 1000000) - 11644473600, 'unixepoch', 'localtime') AS visitTime,
  urls.url AS visitUrl,
  urls.visit_count AS urlVisitCount,
  visits.visit_duration AS visitDuration,
  datetime((urls.last_visit_time/1000000)-11644473600, 'unixepoch', 'localtime', 'utc') AS lastVisitTime,
  urls.title AS visitTitle,
  CASE visits.transition & 0xFF
  WHEN 0 THEN 'Link'
  WHEN 1 THEN 'Typed'
  WHEN 2 THEN 'Auto_Bookmark'
  WHEN 3 THEN 'Auto_Subframe'
  WHEN 4 THEN 'Manual_Subframe'
  WHEN 5 THEN 'Generated'
  WHEN 6 THEN 'Auto_Toplevel'
  WHEN 7 THEN 'Form_Submit'
  WHEN 8 THEN 'Reload'
  WHEN 9 THEN 'Keyword'
  WHEN 20 THEN 'Keyword_Generated'
  END AS transition,
  visits.from_visit AS fromVisitId,
  SecondQuery.visit_time AS fromVisitTime,
  SecondQuery.url AS fromVisitUrl,
  SecondQuery.title AS fromVisitTitle
  FROM visits
  LEFT OUTER JOIN urls ON visits.url = urls.id
  LEFT OUTER JOIN (SELECT urls.url,
  urls.title,
  datetime((visits.visit_time / 1000000) - 11644473600, 'unixepoch', 'localtime') AS visit_time,
  visits.id
  FROM visits
  LEFT JOIN urls ON visits.url = urls.id) SecondQuery ON visits.from_visit = SecondQuery.id
`;

export const getVisitData = (): Promise<IVisit[]> =>
  new Promise((resolve, reject) => {
    const database = new sqlite3.Database(
      "src/tempHistory/History.db",
      sqlite3.OPEN_READONLY,
    );

    database.all(QUERY_VISIT_DATA, [], (err, visits: IVisit[]) => {
      if (err) {
        reject(err);
      }

      resolve(visits);
    });

    database.close();
  });

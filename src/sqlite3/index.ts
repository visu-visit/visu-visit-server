import Database from "better-sqlite3";
import { IVisit } from "../types/history.type";

const QUERY_VISIT_DATA = `
  SELECT
    visits.id AS visitId,
    urls.url AS targetUrl,
    urls.visit_count AS targetUrlVisitCount,
    visits.visit_duration / 1000 / 1000 AS visitDuration,
    datetime((visits.visit_time / 1000000) - 11644473600, 'unixepoch', 'localtime') AS visitTime,
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
      END AS transitionType,
    SecondQuery.url AS sourceUrl,
    SecondQuery.visit_count AS sourceUrlVisitCount
  FROM visits
  LEFT OUTER JOIN urls ON visits.url = urls.id
  LEFT OUTER JOIN (
    SELECT
      urls.url,
      visits.id,
    urls.visit_count
    FROM visits
    LEFT JOIN urls ON visits.url = urls.id
  )
  SecondQuery ON visits.from_visit = SecondQuery.id
  `;

const VISIT_LIMIT = 30000;

export const getVisitData = (): Promise<IVisit[]> =>
  new Promise((resolve) => {
    const db = new Database("src/tempHistory/History.db");

    const visits = db.prepare(QUERY_VISIT_DATA).all();

    if (visits.length > VISIT_LIMIT) {
      resolve(visits.slice(-VISIT_LIMIT));
    }

    resolve(visits);
  });

export default getVisitData;

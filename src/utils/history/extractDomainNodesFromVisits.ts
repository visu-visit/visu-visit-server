import { nanoid } from "nanoid";
import { IDomainNode, IVisit } from "../../types/history.type";

const extractNodesFromVisits = (visits: IVisit[]): IDomainNode[] => {
  const nodeByDomain: {
    [key: string]: IDomainNode;
  } = {};

  visits.forEach((visit) => {
    const domainName = new URL(visit.visitUrl).origin;

    if (!Object.prototype.hasOwnProperty.call(nodeByDomain, domainName)) {
      nodeByDomain[domainName] = {
        domainName,
        nanoId: nanoid(),
        position: { x: 0, y: 0 },
      } as IDomainNode;
    }
  });

  return Object.values(nodeByDomain);
};

export default extractNodesFromVisits;

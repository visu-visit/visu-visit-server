export interface IVisit {
  visitId: number;
  visitTime: string;
  visitUrl: string;
  urlVisitCount: number;
  visitTitle: string | null;
  visitDuration: string;
  lastVisitTime: string;
  transition:
    | "Link"
    | "Typed"
    | "Auto_Bookmark"
    | "Auto_Subframe"
    | "Manual_Subframe"
    | "Generated"
    | "Auto_Toplevel"
    | "Form_Submit"
    | "Reload"
    | "Keyword"
    | "Keyword_Generated";
  fromVisitId: number;
  fromVisitTime: null | string;
  fromVisitUrl: null | string;
  fromVisitTitle: null | string;
}

export interface IDomainNode {
  domainName: string;
  nanoId: string;
  position: {
    x: Number;
    y: Number;
  };
}

export interface IBrowserHistory {
  nanoId: string;
  totalVisits: IVisit[];
  domainNodes: IDomainNode[];
}

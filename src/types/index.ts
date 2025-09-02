export interface Shift {
  ID: string;
  Date: string;
  StartTime: string;
  EndTime: string;
  Location: string;
  Tips: number;
  Notes: string;
  Tags: string[];
  Hours: number;
  HourlyRate: number;
  coworkers: Coworker[];
  parties: Party[];
}

export interface Coworker {
  ShiftID: string;
  Name: string;
  Position: string;
  Location: string;
  StartTime: string;
  EndTime: string;
}

export interface Party {
  ShiftID: string;
  Name: string;
  Type: string;
  Details: string;
  StartTime: string;
  EndTime: string;
  Bartenders: string[];
}
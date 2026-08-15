export type LaneType = "GENERAL" | "SENTRI" | "READY_LANE" | "PEATONAL";
export type CrossingStatus = "OPEN" | "CLOSED" | "DELAYED";

export interface BorderCrossing {
  id: string;
  portNumber: string;
  name: string;
  city: string; // dominio distinto a BorderCity — ver nota abajo
  latitude: number | null;
  longitude: number | null;
  hoursOfOperation: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WaitTime {
  id: string;
  crossingId: string;
  laneType: LaneType;
  waitMinutes: number;
  lanesOpen: number | null;
  status: CrossingStatus;
  constructionNotice: string | null;
  recordedAt: string;
  createdAt: string;
}

export interface WaitTimePattern {
  id: string;
  crossingId: string;
  laneType: LaneType;
  dayOfWeek: number; // 0-6, domingo-sábado
  hourOfDay: number; // 0-23
  avgWaitMinutes: number;
  sampleCount: number;
  lastCalculatedAt: string;
}
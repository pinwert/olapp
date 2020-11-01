export interface IAction {
  puntuaction: number;
  label: string;
  color?: string;
}

export interface IEvent {
  eventType: string;
  createdAt: number;
  puntuation: number;
  color?: string;
}

export interface IStudent {
  id: string;
  name: string;
  group: string;
  disabled?: boolean;
  events: Array<IEvent>;
  puntuation: number;
}

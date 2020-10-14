export interface IAction {
  puntuaction: number;
  label: string;
}

export interface IEvent {
  eventType: string;
  createdAt: number;
  puntuation: number;
}

export interface IStudent {
  id: string;
  name: string;
  group: string;
  events: Array<IEvent>;
}

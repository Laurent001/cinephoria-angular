import { AuditoriumResponse } from '../film/film';

export interface IncidentResponse {
  incidents: Incident[];
  materials: MaterialResponse[];
  auditoriums: AuditoriumResponse[];
}

export interface Incident {
  id: number;
  description: string;
  added_date: Date;
  is_solved: boolean;
  material: MaterialResponse;
  auditorium: AuditoriumResponse;
}

export interface MaterialResponse {
  id: number;
  name: string;
  description: string;
}

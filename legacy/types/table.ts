import { Guest } from './guest';

export interface Table {
  id: number;
  name: string;
  max_guests: number;
  location: string;
  guests: Guest[];
}

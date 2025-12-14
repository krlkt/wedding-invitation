export interface Guest {
  id: number;
  rsvp_id: number;
  name: string;
  table_id: number | null;
  rsvp_name: string;
  checked_in: boolean;
}

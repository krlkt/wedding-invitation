export interface RSVP {
  id: number;
  name: string;
  attend: string;
  guest_number: number;
  max_guests: number;
  food_choice: 'chicken' | 'lamb' | null;
  notes: string;
  location: string;
  link: string;
  group?: string;
  possibly_not_coming: boolean;
}

export type RSVPForm = Partial<RSVP>;

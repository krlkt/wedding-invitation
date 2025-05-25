export interface RSVP {
    id: number;
    name: string;
    attend: string;
    guest_number: number;
    notes: string;
    location: string;
}

export type RSVPForm = Partial<Omit<RSVP, 'id'>>;

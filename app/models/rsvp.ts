export interface RSVP {
    id: number;
    name: string;
    attend: string;
    guest_number: number;
    max_guest: number;
    notes: string;
    location: string;
}

export type RSVPForm = Partial<RSVP>;

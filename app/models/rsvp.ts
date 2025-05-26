export interface RSVP {
    id: number;
    name: string;
    attend: string;
    guest_number: number;
    max_guests: number;
    notes: string;
    location: string;
    link: string;
}

export type RSVPForm = Partial<RSVP>;

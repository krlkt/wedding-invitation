export interface RSVP {
    id: number;
    name: string;
    attend: string;
    guest_number: number;
    max_guests: number;
    food_choice: 'chicken' | 'lamb';
    notes: string;
    location: string;
    link: string;
    group?: string;
}

export type RSVPForm = Partial<RSVP>;

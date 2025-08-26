import { query } from './client';

export const createTablesTable = async () => {
    await query(`
        CREATE TABLE IF NOT EXISTS tables (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            max_guests INTEGER NOT NULL,
            location TEXT NOT NULL
        );
    `);
};

export const createGuestsTable = async () => {
    await query(`
        CREATE TABLE IF NOT EXISTS guests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            rsvp_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            table_id INTEGER,
            checked_in BOOLEAN NOT NULL DEFAULT 0,
            FOREIGN KEY (rsvp_id) REFERENCES rsvp(id) ON DELETE CASCADE,
            FOREIGN KEY (table_id) REFERENCES tables(id) ON DELETE SET NULL
        );
    `);
};

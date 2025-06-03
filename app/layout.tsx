import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './components/Providers';
import Head from 'next/head';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import ReactDOM from 'react-dom';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Dashboard Wedding List',
    description: 'Dashboard Wedding List',
};

export const viewport: Viewport = {
    viewportFit: 'cover',
};

export function PreloadResources() {
    ReactDOM.preload('/hero.mp4', { as: 'video', type: 'video/mp4' });
    return '...';
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}

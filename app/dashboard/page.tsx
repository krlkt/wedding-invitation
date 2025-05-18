import { Metadata } from 'next';
import DashboardPage from './DashboardPage';

export const metadata: Metadata = {
    title: 'Dashboard',
};

const username = process.env.dashboard_username;
const password = process.env.dashboard_password;

export default async function Page() {
    return <DashboardPage />;
}

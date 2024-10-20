import { Metadata } from 'next';
import InvitationPage from './InvitationPage';
import UnopenedInvitationPage from './UnopenedInvitationPage';

export const metadata: Metadata = {
    title: "Karel & Sabrina's Wedding Invitation",
};

export default function Page({
    params,
    searchParams,
}: {
    params: { location: string };
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    console.log(params);
    console.log(searchParams);
    return 'opened' in searchParams ? (
        <InvitationPage />
    ) : (
        <UnopenedInvitationPage />
    );
}

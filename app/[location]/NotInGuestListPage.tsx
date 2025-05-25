export default function UnidentifiedPerson({ guestName }: { guestName: string }) {
    return (
        <div className="min-h-dvh flex items-center justify-center flex-col gap-4 text-center">
            <h2 className="text-2xl font-bold">Sorry, something went wrong, please contact the groom 😖</h2>
            <p>You might be at the wrong wedding location?</p>
        </div>
    );
}

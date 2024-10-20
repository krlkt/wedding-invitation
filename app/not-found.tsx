import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-dvh flex items-center justify-center flex-col gap-4">
            <h2 className="text-3xl font-bold">Page Not Found</h2>
            <p>Could not find requested resource</p>
            <Link href={'/'}>
                <div
                    className="relative inline-block text-lg font-semibold text-gray-800 hover:text-white transition duration-300 ease-in-out
                   before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r before:from-pink-400 before:to-red-500 
                   before:opacity-0 before:transition before:duration-300 before:ease-in-out
                   hover:before:opacity-100 hover:before:scale-105 px-4 py-2"
                >
                    <span className="relative z-10">Return Home</span>
                </div>
            </Link>
        </div>
    );
}

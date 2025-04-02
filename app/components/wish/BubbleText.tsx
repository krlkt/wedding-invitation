import { FC } from 'react';
import './bubbletext.css';

interface BubbleTextProps {
    name: string;
    message: string;
    createdAt: string;
}

const BubbleText: FC<BubbleTextProps> = ({ name, message, createdAt }) => {
    return (
        <div className="speech-bubble relative bg-white rounded-lg p-2 px-4 text-left shadow-sm">
            <div className="leading-none">
                <span className="text-md font-semibold text-primary-main mr-2">{name}</span>
                <span className="text-sm text-gray-600">{formatTimeAgo(createdAt)}</span>
            </div>
            <p className="text-sm">{message}</p>
        </div>
    );
};

function formatTimeAgo(dateString: string): string {
    // Convert Singapore Time (SGT, UTC+8) to UTC
    const singaporeTime = new Date(dateString.replace(' ', 'T') + 'Z'); // Treat as UTC
    const now = new Date(); // Local system time
    const diffInSeconds = Math.floor((now.getTime() - singaporeTime.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return 'Less than a minute ago';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }

    // More than 7 days → Pretty format with user's local time
    return new Intl.DateTimeFormat(navigator.language, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Convert to user's timezone
    }).format(singaporeTime);
}

export default BubbleText;

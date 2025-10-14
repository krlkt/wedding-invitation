import { FC } from 'react';
import './bubbletext.css';

interface BubbleTextProps {
    name: string;
    message: string;
    createdAt: string;
}

const BubbleText: FC<BubbleTextProps> = ({ name, message, createdAt }) => {
    return (
        <div className="speech-bubble relative bg-blue-50 rounded-lg p-2 px-4 text-left shadow-md">
            <div className="leading-none">
                <span className="text-md font-semibold text-primary-main mr-2">{name}</span>
                <span className="text-sm text-gray-600">{formatTimeAgo(createdAt)}</span>
            </div>
            <p className="text-sm ">{message}</p>
        </div>
    );
};

function formatTimeAgo(dateString: string): string {
    // Parse date string - handles both ISO format and legacy format
    let date: Date;

    try {
        if (dateString.includes('T') || dateString.includes('Z')) {
            // Already ISO format
            date = new Date(dateString);
        } else {
            // Legacy format with space (e.g., "2024-01-01 12:00:00")
            date = new Date(dateString.replace(' ', 'T') + 'Z');
        }

        // Check if date is valid
        if (isNaN(date.getTime())) {
            return 'Recently';
        }
    } catch (e) {
        return 'Recently';
    }

    const now = new Date();
    let diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    // If difference is negative (date in future), take absolute value
    if (diffInSeconds < 0) {
        diffInSeconds = Math.abs(diffInSeconds);
    }

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
    return new Intl.DateTimeFormat('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Convert to user's timezone
    }).format(date);
}

export default BubbleText;

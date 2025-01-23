import { FC } from 'react';
import './bubbletext.css';

interface BubbleTextProps {
    name: string;
    message: string;
}

const BubbleText: FC<BubbleTextProps> = ({ name, message }) => {
    return (
        <div className="speech-bubble relative bg-white rounded-lg p-2 px-4 text-left shadow-sm">
            <span className="text-sm font-semibold text-gray-700">{name}</span>
            <p className="text-sm">{message}</p>
        </div>
    );
};

export default BubbleText;

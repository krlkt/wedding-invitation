'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import MusicIcon from '../icons/MusicIcon';
import PauseIcon from '../icons/PauseIcon';

const Music = () => {
    const audio = useRef<HTMLAudioElement>(null);
    const [playMusic, setPlayMusic] = useState(false);

    const handleMusicClick = useCallback(() => {
        if (playMusic) {
            audio.current?.pause();
            setPlayMusic(false);
        } else {
            audio.current?.play();
            setPlayMusic(true);
        }
    }, [playMusic]);

    useEffect(() => {
        if (audio.current?.paused) setPlayMusic(false);
        else setPlayMusic(true);
    }, [playMusic]);

    return (
        <div className="fixed bottom-6 right-6 z-20">
            <span className="w-12 h-12 absolute top-0 left-0 inline-flex rounded-full  bg-blue-200 opacity-75 ping" />
            <button
                className="bg-blue-200 w-12 h-12 p-3 rounded-full z-10 relative"
                onClick={handleMusicClick}
            >
                {playMusic ? <PauseIcon /> : <MusicIcon />}
            </button>
            <audio id="music" ref={audio} loop>
                <source src="/music/luckyme.mp3" type="audio/mpeg" />
            </audio>
        </div>
    );
};

export default Music;

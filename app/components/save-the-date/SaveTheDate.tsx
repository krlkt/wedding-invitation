import { motion } from 'framer-motion';
import Button from '../Button';
import CalendarIcon from '../../icons/CalendarIcon';
import Image from 'next/image';
import GrowIn from '../GrowIn';
import FadeIn from '../FadeIn';
import { useWeddingData } from '@/app/utils/useWeddingData';

const SaveTheDate = () => {
    const { config } = useWeddingData();

    // Format the date for display
    const weddingDate = new Date(config.weddingDate);
    const dayName = weddingDate.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
    const monthName = weddingDate.toLocaleDateString('en-US', { month: 'short' });
    const day = weddingDate.getDate();
    const year = weddingDate.getFullYear();

    // Generate calendar URL with dynamic names and date
    const calendarTitle = encodeURIComponent(`${config.groomName} and ${config.brideName}'s Wedding Day`);
    const calendarDates =
        weddingDate.toISOString().split('T')[0].replace(/-/g, '') +
        'T070000Z/' +
        weddingDate.toISOString().split('T')[0].replace(/-/g, '') +
        'T160000Z';
    const calendarDetails = encodeURIComponent(
        `The Day ${config.groomName} and ${config.brideName} Say 'I Do'.\n\nA Celebration of Love and A Forever Promise 💍`
    );
    const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${calendarTitle}&dates=${calendarDates}&details=${calendarDetails}`;
    return (
        <div className="relative flex flex-col gap-2 items-center justify-center text-primary-main z-10 w-full py-28">
            <motion.div className="font-cursive_nautigal text-7xl">
                <FadeIn className="text-primary-600/40">Save</FadeIn>
                <FadeIn className="text-primary-700/60 leading-8">the</FadeIn>
                <FadeIn>Date</FadeIn>
            </motion.div>
            <FadeIn className="font-semibold">
                <motion.p className="text-xl z-20">
                    {dayName}
                    <br />
                    {monthName} {day}
                    <sup>th</sup>, {year}
                </motion.p>
            </FadeIn>
            <FadeIn className="mt-2">
                <Button>
                    <a target="_blank" href={calendarUrl}>
                        <span className="flex gap-2 justify-center items-center">
                            Add to calendar
                            <div className="w-4 h-4">
                                <CalendarIcon />
                            </div>
                        </span>
                    </a>
                </Button>
            </FadeIn>
            <GrowIn className="absolute object-contain w-full h-full -z-10">
                <Image src={'/images/ornaments/frame/orn_frame.png'} alt={'Ornament Flower'} fill />
            </GrowIn>
        </div>
    );
};

export default SaveTheDate

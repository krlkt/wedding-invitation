import Image from 'next/image';

import { motion } from 'framer-motion';

import { useWeddingData } from '@/hooks/useWeddingData';

import CalendarIcon from '../icons/CalendarIcon';
import Button from '../Button';
import FadeIn from '../FadeIn';
import GrowIn from '../GrowIn';

const SaveTheDate = () => {
  const { config } = useWeddingData();

  // Format the date for display
  const weddingDate = new Date(config.weddingDate);
  const dayName = weddingDate.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const monthName = weddingDate.toLocaleDateString('en-US', { month: 'short' });
  const day = weddingDate.getDate();
  const year = weddingDate.getFullYear();

  // Generate calendar URL with dynamic names and date
  const calendarTitle = encodeURIComponent(
    `${config.groomName} and ${config.brideName}'s Wedding Day`
  );
  const calendarDates = `${weddingDate
    .toISOString()
    .split('T')[0]
    .replace(/-/g, '')}T070000Z/${weddingDate
    .toISOString()
    .split('T')[0]
    .replace(/-/g, '')}T160000Z`;
  const calendarDetails = encodeURIComponent(
    `The Day ${config.groomName} and ${config.brideName} Say 'I Do'.\n\nA Celebration of Love and A Forever Promise 💍`
  );
  const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${calendarTitle}&dates=${calendarDates}&details=${calendarDetails}`;
  return (
    <div className="relative z-10 flex w-full flex-col items-center justify-center gap-2 py-28 text-primary-main">
      <motion.div className="font-cursive_nautigal text-7xl">
        <FadeIn className="text-primary-600/40">Save</FadeIn>
        <FadeIn className="leading-8 text-primary-700/60">the</FadeIn>
        <FadeIn>Date</FadeIn>
      </motion.div>
      <FadeIn className="font-semibold">
        <motion.p className="z-20 text-xl">
          {dayName}
          <br />
          {monthName} {day}
          <sup>th</sup>, {year}
        </motion.p>
      </FadeIn>
      <FadeIn className="mt-2">
        <Button>
          <a target="_blank" href={calendarUrl} rel="noreferrer">
            <span className="flex items-center justify-center gap-2">
              Add to calendar
              <div className="h-4 w-4">
                <CalendarIcon />
              </div>
            </span>
          </a>
        </Button>
      </FadeIn>
      <GrowIn className="absolute -z-10 h-full w-full object-contain">
        <Image src="/images/ornaments/frame/orn_frame.png" alt="Ornament Flower" fill />
      </GrowIn>
    </div>
  );
};

export default SaveTheDate;

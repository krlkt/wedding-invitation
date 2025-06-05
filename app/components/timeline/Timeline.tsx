import { FC, ReactNode } from 'react';
import MeetIcon from '../../icons/MeetIcon';
import BusIcon from '../../icons/BusIcon';
import CoupleIcon from '../../icons/CoupleIcon';
import RingIcon from '../../icons/RingIcon';
import CatIcon from '@/app/icons/CatIcon';
import { motion } from 'framer-motion';
import { fadeInVariants } from '@/app/utils/animation';

const timelineData = [
    {
        icon: <MeetIcon />,
        title: 'First Met',
        date: 'September 2019',
        description:
            'Karel was on a vacation visiting his best friend in Berlin, where he met Sabrina for the first time in a sport hall',
    },
    {
        icon: <BusIcon />,
        title: 'First Date',
        date: 'October 2019',
        description: 'Karel traveled to Berlin from Trier by Bus (12 hours) to meet Sabrina and have their first date',
    },
    {
        icon: <CoupleIcon />,
        title: 'Official Relationship',
        date: (
            <>
                February 2<sup>nd</sup>, 2020
            </>
        ),
        description: 'They were on a vacation to Prague, where they made their relationship official <3',
    },
    {
        icon: <CatIcon />,
        title: 'Kyupie and Mayo Arrives',
        date: 'July & October 2023',
        description:
            'They decided to buy their first kitten - Kyupie, and 3 months later their second kitten - Mayo. They have brought so much happiness to the couple and choosing them was the best decision they ever made',
    },
    {
        icon: <RingIcon />,
        title: 'The Proposal',
        date: (
            <>
                August 13<sup>th</sup>, 2024
            </>
        ),
        description: 'Karel planned with friends to surprise Sabrina for an unforgettable camping proposal',
    },
];

const Timeline = () => {
    const isLeft = (index: number) => index % 2 === 0;
    return (
        <div className="px-4">
            {timelineData.map(({ icon, title, date, description }, index) => (
                <Row
                    key={index}
                    icon={icon}
                    leftSide={isLeft(index)}
                    title={title}
                    date={date}
                    description={description}
                />
            ))}
        </div>
    );
};

export default Timeline;

interface RowProps extends ParagraphProps {
    icon: ReactNode;
    // Whether the description paragraph should be on the left side
    leftSide: boolean;
}

const Row: FC<RowProps> = ({ title, date, description, icon, leftSide }) => {
    const wrappedIcon = (
        <div className={`text-secondary-main max-w-40 min-w-28 ${!leftSide && 'justify-self-end'}`}>{icon}</div>
    );

    return (
        <motion.div
            className="grid grid-cols-[1fr_auto_1fr] items-center gap-8 relative"
            variants={fadeInVariants}
            initial="initial"
            whileInView={'animate'}
            viewport={{ once: true }}
        >
            {/* Left side */}
            {leftSide ? (
                <Paragraph leftSide={leftSide} title={title} date={date} description={description} />
            ) : (
                wrappedIcon
            )}

            {/* Vertical line in the middle */}
            <div className="relative flex flex-col items-center  self-stretch">
                <div className="w-[0.5px] h-full bg-secondary-main" />
                <div className="absolute bottom-0 w-2 h-2 rounded-full bg-secondary-main" />
            </div>

            {/* Right side */}
            {leftSide ? (
                wrappedIcon
            ) : (
                <Paragraph title={title} date={date} description={description} leftSide={leftSide} />
            )}
        </motion.div>
    );
};

interface ParagraphProps {
    title: string;
    date: string | ReactNode;
    description: string;
    leftSide: boolean;
}
const Paragraph: FC<ParagraphProps> = ({ title, date, description, leftSide }) => (
    <div className={`flex flex-col gap-1 font-serif text-sm py-2 ${leftSide && 'text-right'}`}>
        <h4 className="text-2xl">{title}</h4>
        <p className="font-semibold text-lg">{date}</p>
        <p className="leading-4">{description}</p>
    </div>
);

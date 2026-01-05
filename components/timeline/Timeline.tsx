import { FC, ReactNode, memo } from 'react';

import { motion } from 'framer-motion';

import { fadeInVariants } from '@/lib/animation';
import type { LoveStorySegment } from '@/db/schema/content';
import { getIconComponentForPreview, type IconType } from '@/lib/icon-mapping';

interface TimelineProps {
  segments: LoveStorySegment[];
}

const Timeline: FC<TimelineProps> = ({ segments }) => {
  const isLeft = (index: number) => index % 2 === 0;

  return (
    <div>
      {segments.map((segment, index) => (
        <Row
          key={segment.id}
          icon={getIconComponentForPreview(segment.iconType as IconType)}
          leftSide={isLeft(index)}
          title={segment.title}
          date={segment.date}
          description={segment.description}
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

const Row: FC<RowProps> = memo(({ title, date, description, icon, leftSide }) => {
  const wrappedIcon = (
    <div
      className={`w-full min-w-20 max-w-24 text-secondary-main ${!leftSide && 'justify-self-end'}`}
    >
      {icon}
    </div>
  );

  return (
    <motion.div
      className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-8"
      variants={fadeInVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
    >
      {/* Left side */}
      {leftSide ? (
        <Paragraph leftSide={leftSide} title={title} date={date} description={description} />
      ) : (
        wrappedIcon
      )}

      {/* Vertical line in the middle */}
      <div className="relative flex flex-col items-center self-stretch">
        <div className="h-full w-[0.5px] bg-secondary-main" />
        <div className="absolute bottom-0 h-2 w-2 rounded-full bg-secondary-main" />
      </div>

      {/* Right side */}
      {leftSide ? (
        wrappedIcon
      ) : (
        <Paragraph title={title} date={date} description={description} leftSide={leftSide} />
      )}
    </motion.div>
  );
});

Row.displayName = 'Row';

interface ParagraphProps {
  title: string;
  date: string | ReactNode;
  description: string;
  leftSide: boolean;
}
const Paragraph: FC<ParagraphProps> = ({ title, date, description, leftSide }) => (
  <div className={`flex flex-col gap-1 py-2 font-serif text-sm ${leftSide && 'text-right'}`}>
    <h4 className="text-2xl">{title}</h4>
    <p className="text-lg font-semibold">{date}</p>
    <p className="leading-4">{description}</p>
  </div>
);

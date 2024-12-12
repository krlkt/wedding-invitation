import { FC } from 'react';

const Timeline = () => (
    <div id="history-container" className="flex flex-col gap-2">
        <TimelineItem
            title={'First met'}
            date={'17th September 2020'}
            content={'They met for the first time in a sport hall'}
        />
        <TimelineItem
            title={'First date'}
            date={'17th September 2020'}
            content={
                'Karel traveled to Berlin to meet Sabrina and have their first date :)'
            }
        />
        <TimelineItem
            title={'Karel and Sabrina is in an official relationship'}
            date={'17th September 2020'}
            content={'Karel asked Sabrina out!'}
        />
        <TimelineItem
            title={'Their first and second pet'}
            date={'17th September 2020'}
            content={'Kyupie is adopted!'}
        />
        <TimelineItem
            title={'Proposal 💍'}
            date={'17th September 2020'}
            content={
                'Karel planned with friends to surprise Sabrina for an unforgetable proposal'
            }
        />
    </div>
);

export default Timeline;

interface TimelineItemProps {
    title: string;
    date: string;
    content: string;
}
const TimelineItem: FC<TimelineItemProps> = ({ title, date, content }) => (
    <div className="flex gap-1">
        <div className="mt-3 w-2 h-2 bg-slate-400 rounded-full" />
        <div className="bg-white shadow-sm border rounded p-1 w-full">
            <h5>{title}</h5>
            <h6>{date}</h6>
            {content}
        </div>
    </div>
);

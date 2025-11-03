import { FC } from 'react'

import Image from 'next/image'

const Timeline = () => (
  <div id="love-story-container" className="relative flex flex-col gap-4">
    {/* Vertical line for timeline */}
    <div className="absolute left-[5px] top-0 h-full w-[2px] bg-slate-400" />
    <TimelineItem
      imgSrc="/images/sporthall.jpg"
      title="First met"
      date="17th September 2020"
      content="They met for the first time in a sport hall"
    />
    <TimelineItem
      imgSrc="/images/first_date.jpg"
      title="First date"
      date="17th September 2020"
      content="Karel traveled to Berlin to meet Sabrina and have their first date"
    />
    <TimelineItem
      imgSrc="/images/ask_out.jpg"
      title="Official relationship"
      date="17th September 2020"
      content="Karel asked Sabrina out!"
    />
    <TimelineItem
      imgSrc="/images/kyupie.jpg"
      title="Their first and second pet"
      date="17th September 2020"
      content="Kyupie is adopted!"
    />
    <TimelineItem
      imgSrc="/images/proposal.jpg"
      title="Proposal 💍"
      date="17th September 2020"
      content="Karel planned with friends to surprise Sabrina for an unforgetable proposal"
    />
  </div>
)

export default Timeline

interface TimelineItemProps {
  title: string
  date: string
  content: string
  imgSrc: string
}
const TimelineItem: FC<TimelineItemProps> = ({ title, date, content, imgSrc }) => (
  <div className="flex gap-2">
    {/* dot */}
    <div className="relative z-10 flex-shrink-0">
      <div className="h-3 w-3 rounded-full bg-slate-400" />
    </div>
    {/* Image and content */}
    <div className="relative min-h-48 w-full overflow-hidden rounded border bg-white shadow-sm">
      <div className="absolute left-0 top-0 z-0 h-full w-full">
        <Image src={imgSrc} alt="image alt" fill className="object-cover" />
      </div>
      {/* Gradient overlay */}
      <div className="absolute left-0 top-0 z-10 h-full w-full bg-gradient-to-b from-transparent to-black/70" />
      {/* Content */}
      <div className="absolute bottom-0 z-20 p-4">
        {/* Title and Date inline */}
        <div className="mb-1 flex flex-wrap items-start gap-x-4">
          <h5 className="text-lg font-bold leading-tight text-white drop-shadow-md">{title}</h5>
          <h6 className="text-sm italic text-white opacity-80">{date}</h6>
        </div>
        {/* Content */}
        <p className="text-sm text-white">{content}</p>
      </div>
    </div>
  </div>
)

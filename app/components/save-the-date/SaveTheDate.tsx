import { motion } from 'framer-motion'
import Button from '../Button'
import CalendarIcon from '../../icons/CalendarIcon'
import Image from 'next/image'
import GrowIn from '../GrowIn'
import FadeIn from '../FadeIn'
import { useLocation } from '@/app/utils/useLocation'

const SaveTheDate = () => {
  const { location } = useLocation()
  return (
    <div className="relative z-10 flex w-full flex-col items-center justify-center gap-2 py-28 text-primary-main">
      <motion.div className="font-cursive_nautigal text-7xl">
        <FadeIn className="text-primary-600/40">Save</FadeIn>
        <FadeIn className="leading-8 text-primary-700/60">the</FadeIn>
        <FadeIn>Date</FadeIn>
      </motion.div>
      <FadeIn className="font-semibold">
        <motion.p className="z-20 text-xl">
          {location === 'bali' && (
            <>
              TUESDAY
              <br />
              Sept 9<sup>th</sup>, 2025
            </>
          )}
          {location === 'malang' && (
            <>
              SATURDAY
              <br />
              Sept 13<sup>th</sup>, 2025
            </>
          )}
          {location === 'jakarta' && (
            <>
              SATURDAY
              <br />
              Sept 20<sup>th</sup>, 2025
            </>
          )}
        </motion.p>
      </FadeIn>
      <FadeIn className="mt-2">
        <Button>
          <a
            target="_blank"
            href={
              location === 'bali'
                ? "https://www.google.com/calendar/render?action=TEMPLATE&text=Karel%20and%20Sabrina's%20Wedding%20Day&dates=20250909T070000Z/20250909T160000Z&details=The%20Day%20Karel%20and%20Sabrina%20Say%20%E2%80%98I%20Do%E2%80%99.%0A%0AA%20Celebration%20of%20Love%20and%20A%20Forever%20Promise%20%F0%9F%92%8D&location=Tirtha%20Uluwatu,%20Bali"
                : location === 'malang'
                  ? "https://www.google.com/calendar/render?action=TEMPLATE&text=Karel%20and%20Sabrina's%20Reception%20Day&dates=20250913T070000Z/20250913T160000Z&details=Karel%20and%20Sabrina%27s%20Wedding%20Reception at 6 PM.%0A%0AA%20Celebration%20of%20Love%20and%20A%20Forever%20Promise%20%F0%9F%92%8D&location=KDS%20Malang"
                  : "https://www.google.com/calendar/render?action=TEMPLATE&text=Karel%20and%20Sabrina's%20Reception%20Day&dates=20250920T070000Z/20250920T160000Z&details=Karel%20and%20Sabrina%27s%20Wedding%20Reception at 6 PM.%0A%0AA%20Celebration%20of%20Love%20and%20A%20Forever%20Promise%20%F0%9F%92%8D&location=Angke+Kelapa+Gading, Jakarta"
            }
          >
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
        <Image src={'/images/ornaments/frame/orn_frame.png'} alt={'Ornament Flower'} fill />
      </GrowIn>
    </div>
  )
}

export default SaveTheDate

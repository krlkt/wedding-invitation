import { motion } from 'framer-motion';
import Button from './Button';
import { Stagger } from '../utils/animation';
import CalendarIcon from '../icons/CalendarIcon';
import Image from 'next/image';

const SaveTheDate = () => (
    <motion.div
        variants={Stagger.containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative flex flex-col gap-2 items-center justify-center text-primary-main my-36"
    >
        <Image
            src={'/images/ornaments/orn_gate.png'}
            alt={'Gate'}
            width={500}
            height={1400}
            className="absolute min-w-[400px]"
        />
        <div className="relative py-10 w-full h-full">
            <motion.div className="font-cursive_nautigal text-7xl">
                <motion.p className="text-primary-600/40" variants={Stagger.itemVariants}>
                    Save
                </motion.p>
                <motion.p className="text-primary-700/60 leading-8" variants={Stagger.itemVariants}>
                    the
                </motion.p>
                <motion.p variants={Stagger.itemVariants}>Date</motion.p>
            </motion.div>
            <motion.div variants={Stagger.itemVariants} className="flex flex-col gap-2 items-center">
                <motion.p className="">for the wedding of</motion.p>
                <motion.p className="uppercase text-xl">Karel & Sabrina</motion.p>
                <motion.p className="text-lg mb-4 font-semibold">9th of September 2025</motion.p>
                <Button>
                    <a
                        target="_blank"
                        href="https://calendar.google.com/calendar/event?action=TEMPLATE&amp;tmeid=X2M1cGpjb2ppOTFubDZ0YTM2MHIzaWtpaWFoMTNndWFrNzU0bmViamZkZyBrYXJlbGthcnVuaWEyNEBt&amp;tmsrc=karelkarunia24%40gmail.com"
                    >
                        <span className="flex gap-2 justify-center items-center">
                            Add to calendar
                            <div className="w-4 h-4">
                                <CalendarIcon />
                            </div>
                        </span>
                    </a>
                </Button>
            </motion.div>
        </div>
    </motion.div>
);

export default SaveTheDate;

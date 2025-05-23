import { motion } from 'framer-motion';
import Button from '../Button';
import { Stagger } from '../../utils/animation';
import CalendarIcon from '../../icons/CalendarIcon';
import Image from 'next/image';
import SectionTitle from '../SectionTitle';

const SaveTheDate = () => (
    <motion.div
        variants={Stagger.containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative flex flex-col gap-2 items-center justify-center text-primary-main z-10 w-full my-40"
    >
        <Image
            src={'/images/ornaments/orn_gate.png'}
            alt={'Ornament Flower'}
            width={400}
            height={800}
            className="absolute object-contain scale-150 w-[min(100%,400px)] h-[22rem]"
        />
        <div className="relative w-full h-full">
            <motion.div className="font-cursive_nautigal text-6xl pt-10">
                <motion.p className="text-primary-600/40" variants={Stagger.itemVariants}>
                    Save
                </motion.p>
                <motion.p className="text-primary-700/60 leading-8" variants={Stagger.itemVariants}>
                    the
                </motion.p>
                <motion.p variants={Stagger.itemVariants}>Date</motion.p>
            </motion.div>
            <motion.div variants={Stagger.itemVariants}>
                <motion.p className="text-2xl z-20 mb-4">
                    TUESDAY
                    <br /> Sept 9<sup>th</sup>, 2025
                </motion.p>
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

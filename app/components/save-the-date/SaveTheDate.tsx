import { motion } from 'framer-motion';
import Button from '../Button';
import { Stagger } from '../../utils/animation';
import CalendarIcon from '../../icons/CalendarIcon';
import Image from 'next/image';

const SaveTheDate = () => (
    <motion.div
        variants={Stagger.containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative flex flex-col gap-2 items-center justify-center text-primary-main z-10 w-full py-28"
    >
        <motion.div className="font-cursive_nautigal text-7xl">
            <motion.p className="text-primary-600/40" variants={Stagger.itemVariants}>
                Save
            </motion.p>
            <motion.p className="text-primary-700/60 leading-8" variants={Stagger.itemVariants}>
                the
            </motion.p>
            <motion.p variants={Stagger.itemVariants}>Date</motion.p>
        </motion.div>
        <motion.div variants={Stagger.itemVariants} className="font-semibold">
            <motion.p className="text-xl z-20">
                TUESDAY
                <br /> Sept 9<sup>th</sup>, 2025
            </motion.p>
        </motion.div>
        <motion.div variants={Stagger.itemVariants} className="mt-2">
            <Button>
                <a
                    target="_blank"
                    href="https://www.google.com/calendar/render?action=TEMPLATE&text=Karel%20and%20Sabrina's%20Wedding%20Day&dates=20250909T070000Z/20250909T160000Z&details=The%20Day%20Karel%20and%20Sabrina%20Say%20%E2%80%98I%20Do%E2%80%99.%0A%0AA%20Celebration%20of%20Love%20and%20A%20Forever%20Promise%20%F0%9F%92%8D&location=Tirtha%20Uluwatu,%20Bali"
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
        <div className="absolute object-contain w-full h-full -z-10">
            <Image src={'/images/ornaments/frame/orn_frame.png'} alt={'Ornament Flower'} fill />
        </div>
    </motion.div>
);

export default SaveTheDate;

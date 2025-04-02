import { motion } from 'framer-motion';
import Button from './Button';
import { Stagger } from '../utils/animation';
import CalendarIcon from '../icons/CalendarIcon';

const SaveTheDate = () => (
    <motion.div
        variants={Stagger.containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative flex flex-col gap-2 items-center text-primary-main py-14"
    >
        <motion.div className="font-cursive_nautigal text-8xl">
            <motion.p className="text-primary-600/40" variants={Stagger.itemVariants}>
                Save
            </motion.p>
            <motion.p className="text-primary-700/60 leading-8" variants={Stagger.itemVariants}>
                the
            </motion.p>
            <motion.p variants={Stagger.itemVariants}>Date</motion.p>
        </motion.div>
        <motion.div variants={Stagger.itemVariants} className="flex flex-col gap-2 items-center">
            <motion.p className="uppercase ">for the wedding of</motion.p>
            <motion.p className="uppercase text-2xl font-semibold">Karel & Sabrina</motion.p>
            <motion.p className="text-lg mb-4">9th of September 2025</motion.p>
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
    </motion.div>
);

export default SaveTheDate;

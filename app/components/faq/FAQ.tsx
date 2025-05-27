import DownIcon from '@/app/icons/DownIcon';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

const faq = [
    {
        question: 'What to do in Bali?',
        answer: 'Whatever you like as long as you are happy Whatever you like as long as you are happy Whatever you like as long as you are happy Whatever you like as long as you are happy',
    },
    {
        question: 'What to do in Bali?',
        answer: 'Whatever you like as long as you are happy Whatever you like as long as you are happy Whatever you like as long as you are happy Whatever you like as long as you are happy',
    },
    {
        question: 'What to do in Bali?',
        answer: 'Whatever you like as long as you are happy Whatever you like as long as you are happy Whatever you like as long as you are happy Whatever you like as long as you are happy',
    },
    {
        question: 'What to do in Bali?',
        answer: 'Whatever you like as long as you are happy Whatever you like as long as you are happy Whatever you like as long as you are happy Whatever you like as long as you are happy',
    },
];
const FAQ = () => (
    <>
        {faq.map(({ question, answer }, index) => (
            <Accordion key={index} className="w-full">
                <AccordionSummary expandIcon={<DownIcon />} className="font-semibold text-xl">
                    {question}
                </AccordionSummary>
                <AccordionDetails>{answer}</AccordionDetails>
            </Accordion>
        ))}
    </>
);

export default FAQ;

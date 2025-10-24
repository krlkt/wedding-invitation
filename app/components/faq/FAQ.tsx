import DownIcon from '@/app/icons/DownIcon'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import type { FAQItem } from '@/app/db/schema/content'

interface FAQProps {
  faqs: FAQItem[]
}

const FAQ = ({ faqs }: FAQProps) => (
  <>
    {faqs.map(({ question, answer }, index) => (
      <Accordion key={index} className="w-full">
        <AccordionSummary expandIcon={<DownIcon />} className="text-xl font-semibold">
          {question}
        </AccordionSummary>
        <AccordionDetails>{answer}</AccordionDetails>
      </Accordion>
    ))}
  </>
)

export default FAQ
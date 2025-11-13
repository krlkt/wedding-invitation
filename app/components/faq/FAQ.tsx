import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import type { FAQItem } from '@/app/db/schema/content'

interface FAQProps {
  faqs: FAQItem[]
}

const FAQ = ({ faqs }: FAQProps) => (
  <div className="w-full space-y-2">
    {faqs.map(({ id, question, answer }) => (
      <Accordion type="single" key={id} collapsible className="w-full text-base rounded-lg border overflow-hidden">
        <AccordionItem value={id}>
          <AccordionTrigger className="bg-white font-semibold px-4 py-3 hover:no-underline hover:bg-gray-50">
            {question}
          </AccordionTrigger>

          <AccordionContent className="bg-gray-50 text-black px-4 py-3">
            {answer}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    ))}
  </div>
)

export default FAQ
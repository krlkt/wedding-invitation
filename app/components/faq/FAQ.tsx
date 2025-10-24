import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import type { FAQItem } from '@/app/db/schema/content'

interface FAQProps {
  faqs: FAQItem[]
}

const FAQ = ({ faqs }: FAQProps) => (
  <div className="w-full space-y-2">
    {faqs.map(({ id, question, answer }) => (
      <Accordion type="single" key={id} collapsible className="w-full border rounded-lg">
        <AccordionItem value={id}>
          <AccordionTrigger className="text-lg font-semibold">{question}</AccordionTrigger>
          <AccordionContent className="text-sm text-gray-600">{answer}</AccordionContent>
        </AccordionItem>
      </Accordion>
    ))}
  </div>
)

export default FAQ

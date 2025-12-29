import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/shadcn/accordion';
import type { FAQItem } from '@/db/schema/content';

interface FAQProps {
  faqs: Partial<FAQItem>[];
}

const FAQ = ({ faqs }: FAQProps) => (
  <div className="w-full space-y-2">
    {faqs
      .filter((faq) => faq.id && faq.question && faq.answer)
      .map(({ id, question, answer }) => (
        <Accordion
          type="single"
          key={id}
          collapsible
          className="w-full overflow-hidden rounded-lg border text-base"
        >
          <AccordionItem value={id!}>
            <AccordionTrigger className="bg-white px-4 py-3 font-semibold hover:bg-gray-50 hover:no-underline">
              {question}
            </AccordionTrigger>

            <AccordionContent className="bg-gray-50 px-4 py-3 text-black">
              {answer}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
  </div>
);

export default FAQ;

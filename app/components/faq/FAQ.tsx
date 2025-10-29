import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'

import DownIcon from '@/app/icons/DownIcon'

const faq = [
  {
    question: 'When is the RSVP Deadline?',
    answer:
      'Thank you in advance for sending your RSVP before 09.07.2025 as we need time to thoroughly plan our wedding.',
  },
  {
    question: "What's the easiest way to get to and from your wedding venue(s)?",
    answer:
      'We recommend you to use Grab/Gojek(car) to the wedding venue if you are planning to attend the after-party. Feel free to use your own vehicle and parking at the venue will be provided.',
  },
  {
    question: 'Am I allowed to bring a plus-one?',
    answer:
      "We are not allowing additional plus-ones to our wedding, as we'd like to keep the guests list just to those who know us well. The name of every guest invited to attend is clearly listed on your invitation and no additional guests can be accommodated.",
  },
  {
    question: 'What time should I arrive at your wedding ceremony?',
    answer:
      'The doors to the venue will open at 15:00. The wedding ceremony will be held at 16:00 in the chapel. We recommend arriving at the venue at 15:15 to ensure you have enough time to walk to the ceremony space (located about a 5-minute walk from the parking lot) and find a seat.',
  },
  {
    question: 'What time will your wedding reception end? Is there an after-party?',
    answer:
      "Our reception will end around 21:00, after which there will be an after-party. We'll be providing transport home to any guests who are interested in joining the after-party.",
  },
  {
    question: 'What will the weather be like this time of year?',
    answer:
      'Bali summers are warm and humid, so we recommend guests to wear attires that are not so thick as it can be quite hot during the entire wedding. Dont forget to use sunblock and bring sunglasses :)',
  },
]
const FAQ = () => (
  <>
    {faq.map(({ question, answer }, index) => (
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

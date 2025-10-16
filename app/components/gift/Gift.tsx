import GiftIcon from '../../icons/GiftIcon'
import Button from '../Button'
import Modal from '../Modal'
import Image from 'next/image'
import './gift.css'
import { useState } from 'react'
import FadeIn from '../FadeIn'

const Gift = () => {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <div className="flex flex-col gap-4">
      <Modal
        open={open}
        onClose={() => {
          setOpen(false)
        }}
      >
        <div className="flex h-full w-full -translate-y-20 flex-col items-center justify-center gap-8 p-4">
          Please send your gift to the following account numbers:
          <div className="background-pattern flex items-center justify-start gap-4 self-stretch rounded-lg border-2 border-secondary-main p-4">
            <div id="logo" className="relative h-14 w-14">
              <Image
                src="/images/logos/ocbc.png"
                alt={'OCBC logo'}
                fill
                className="block h-auto w-full"
              />
            </div>
            <div className="text-left">
              <p className="font-bold">OCBC</p>
              Karel Karunia
              <br />
              505810127041
            </div>
          </div>
          <div className="background-pattern flex items-center justify-start gap-4 self-stretch rounded-lg border-2 border-secondary-main p-4">
            <div id="logo" className="relative h-16 w-16">
              <Image
                src="/images/logos/paypal.png"
                alt={'Paypal logo'}
                fill
                className="block w-full"
              />
            </div>
            <div className="text-left">
              <p className="font-bold">Paypal</p>
              <p>karelkarunia24@gmail.com</p>
              <a
                href="https://paypal.me/karelkarunia"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Link to my paypal
              </a>
              <p className="text-xs">*please choose friends and family</p>
            </div>
          </div>
        </div>
      </Modal>
      <FadeIn>
        <p className="text-md">
          Having you celebrate with us is the greatest gift. However, if you&#39;d like to send a
          token of your love, please click the button below.
          <br />
          Thank you for your kindness! 💕
        </p>
      </FadeIn>
      <FadeIn>
        <Button onClick={() => setOpen(true)}>
          <span className="flex items-center justify-center gap-2">
            Send gift
            <div className="h-4 w-4">
              <GiftIcon />
            </div>
          </span>
        </Button>
      </FadeIn>
    </div>
  )
}

export default Gift

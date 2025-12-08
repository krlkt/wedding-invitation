import InstagramIcon from '@/components/icons/InstagramIcon'

import Avatar from '../Avatar'

const BrideAndGroom = () => (
  <>
    <h2 className="font-cursive_nautigal text-5xl text-gray-700">Bride & Groom</h2>
    <div className="flex flex-col items-center justify-center gap-4">
      <Avatar src="/images/wife_to_be.jpg" />
      <div className="flex flex-col gap-1">
        <h4 className="text-2xl font-bold text-gray-800">Sabrina Alvina Budiono</h4>
        <div className="text-gray-700">
          <p>First child Of</p>
          <p>Hadi Budiono</p>
          <p>& Weny</p>
        </div>
        <a
          className="flex items-center justify-center gap-2"
          href="https://www.instagram.com/sabrinaalvina?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
        >
          <InstagramIcon width="14px" />
          <span className="text-sm">sabrinaalvina</span>
        </a>
      </div>
    </div>
    <div className="flex flex-col items-center justify-center gap-4">
      <Avatar src="/images/husband_to_be.jpg" />
      <div className="flex flex-col gap-1">
        <h4 className="text-2xl font-bold text-gray-800">Karel Karunia</h4>
        <div className="text-gray-700">
          <p>Third child Of</p>
          <p>Rendy Tirtanadi</p>
          <p>& Elliana Firmanto</p>
        </div>
        <a
          className="flex items-center justify-center gap-2"
          href="https://www.instagram.com/karelkarunia?igsh=aTJoeDVndXZmN3I4"
        >
          <InstagramIcon width="14px" />
          <span className="text-sm">karelkarunia</span>
        </a>
      </div>
    </div>
  </>
)

export default BrideAndGroom

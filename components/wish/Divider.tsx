import WishIcon from '@/components/icons/WishIcon'

const Divider = () => (
  <div className="flex items-center gap-4">
    <div className="my-2 h-[0.5px] w-full bg-primary-main" />
    <div className="flex h-20 w-20 items-center">
      <WishIcon />
    </div>
    <div className="my-2 h-[0.5px] w-full bg-primary-main" />
  </div>
)

export default Divider

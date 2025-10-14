import { FC } from 'react'
import Image from 'next/image'

interface AvatarProps {
  src: string
}

const Avatar: FC<AvatarProps> = ({ src }) => {
  return (
    <Image
      src={src}
      alt="Husband to be"
      width={500}
      height={500}
      className="h-[180px] w-[180px] rounded-full object-cover object-top"
    />
  )
}

export default Avatar

import Image from 'next/image'
import React from 'react'

type Props = {}

const Loader = (props: Props) => {
  return (
    <div className='flex-center w-full'>
        <Image
        src={"/logo.png"}
        alt='logo'
        width={24}
        height={24}
        ></Image>
    </div>
  )
}

export default Loader
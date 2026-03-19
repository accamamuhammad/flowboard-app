import React from 'react'

type Props = {
  title: string
}

const AshBtn = ({ title }: Props) => {
  return (
    <button className='text-sm px-4 py-2 text-asphalt shadow-sm border border-wind rounded-md hover:bg-neutral-100 cursor-pointer'>
      {title}
    </button>
  )
}

export default AshBtn
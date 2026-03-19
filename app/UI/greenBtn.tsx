import React from 'react'

type Props = {
  title: string
}

const GreenBtn = ({ title }: Props) => {
  return (
    <button className="text-sm border px-4 py-2 bg-newt rounded-md text-heaven hover:bg-neutral-50 hover:border-green-900 hover:text-green-900 cursor-pointer">
      {title}
    </button>
  );
}

export default GreenBtn
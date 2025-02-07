import React from 'react'
import Search from './Search'
import User from './User'

const Left = () => {
  return (
    <div className='w-[30%]
    bg-black text-white'>
      <h1 className='font-bold text-3xl p-2 px-11'>
        Chats
      </h1>
      <Search/>
      <hr></hr>
     <User/>
    </div>
  )
}

export default Left;

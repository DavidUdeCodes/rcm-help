import React from 'react'
import { Link } from 'react-router-dom'

const SightReading = () => {
  return (
    <div className='main-font min-h-screen flex flex-col items-center justify-center bg-main-background text-center p-4 space-y-8'>
        <h1 className='text-5xl text-gray-600 mb-20'>This page is coming soon</h1>
        <Link to={"/"}>
            <button className='bg-blue-400 text-white text-2xl font-bold py-4 px-8 rounded-2xl shadow
            transition duration-300 ease-in-out transform scale-[1.5] hover:bg-blue-500 hover:scale-[1.6]'>Go back Home</button>
        </Link>
    </div>
  )
}

export default SightReading
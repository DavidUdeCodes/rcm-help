import React, {useState} from 'react'
import Metronome from '../components/Metronome.jsx'

const MetronomePage = () => {
  return (
      <div className='pt-16'>
        <div className="main-font h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-main-background text-center">
          <div className='scale-150'>
            <h1 className="text-3xl md:text-4xl font-medium mb-6 text-gray-800">Metronome</h1>

            <Metronome />
          </div>
        </div>
      </div> 
  );
}

export default MetronomePage;
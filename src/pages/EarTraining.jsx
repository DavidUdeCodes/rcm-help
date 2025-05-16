import { Link } from 'react-router-dom'

const EarTraining = () => {
  return (
    <div className='pt-16'>
      <div className="main-font h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-main-background text-center lg:px-80">
        <h1 className="text-6xl font-medium text-gray-800 mb-14">Ear Training</h1>

        <div className="flex flex-wrap justify-center gap-x-32 gap-y-11">
          <Link to="/interval-test" >
            <button className="bg-blue-400 text-white text-2xl font-bold py-4 px-8 rounded-2xl shadow
              transition duration-300 ease-in-out transform scale-[1.4] hover:bg-blue-500 hover:scale-[1.5]">
              Interval Recognition
            </button>
          </Link>
          <Link to="/chord-test">
            <button className="bg-blue-400 text-white text-2xl font-bold py-4 px-8 rounded-2xl shadow
                transition duration-300 ease-in-out transform scale-[1.4] hover:bg-blue-500 hover:scale-[1.5]">
              Chord Recognition
            </button>
          </Link>
          <Link to="/chordprg-test">
            <button className="bg-blue-400 text-white text-2xl font-bold py-4 px-8 rounded-2xl shadow
                transition duration-300 ease-in-out transform scale-[1.4] hover:bg-blue-500 hover:scale-[1.5]">
              Chord Progressions
            </button>
          </Link>
          <Link to="/melody-playback">
            <button className="bg-blue-400 text-white text-2xl font-bold py-4 px-8 rounded-2xl shadow
                transition duration-300 ease-in-out transform scale-[1.4] hover:bg-blue-500 hover:scale-[1.5]">
              Melody Playback
            </button>
          </Link>
          <Link to="">
            <button className="bg-blue-400 text-white text-2xl font-bold py-4 px-8 rounded-2xl shadow
                transition duration-300 ease-in-out transform scale-[1.4] hover:bg-blue-500 hover:scale-[1.5]">
              Practice Exam
            </button>
          </Link>
        </div>
      </div>
    </div> 
  )
}

export default EarTraining
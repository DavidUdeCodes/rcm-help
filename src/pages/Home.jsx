import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className='pt-16'>
      <div className="main-font h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-main-background text-center">
        <h1 className="text-6xl font-medium text-gray-800 mb-8">RCM Piano Help</h1>
        <p className="text-lg max-w-md text-gray-600 mb-12 px-4">
          Here to help you practice RCM piano material, while also providing tests to aid in preparation for an RCM exam
        </p>

        <div className="flex flex-col space-y-11">
          <Link to="/technique" >
            <button className="bg-blue-400 text-white text-2xl font-bold py-4 px-8 rounded-2xl shadow
              transition duration-300 ease-in-out transform scale-[1.4] hover:bg-blue-500 hover:scale-[1.5]">
              Technique
            </button>
          </Link>
          <Link to="/ear-training">
            <button className="bg-blue-400 text-white text-2xl font-bold py-4 px-8 rounded-2xl shadow
                transition duration-300 ease-in-out transform scale-[1.4] hover:bg-blue-500 hover:scale-[1.5]">
              Ear Training
            </button>
          </Link>
          <Link to="/sight-reading">
            <button className="bg-blue-400 text-white text-2xl font-bold py-4 px-8 rounded-2xl shadow
                transition duration-300 ease-in-out transform scale-[1.4] hover:bg-blue-500 hover:scale-[1.5]">
              Sight Reading
            </button>
          </Link>
        </div>
      </div>
    </div> 
  );
}

export default Home;
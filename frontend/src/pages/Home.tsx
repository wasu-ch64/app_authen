import React from 'react'
import Navbar from '../components/Navbar/Navbar'

const Home = () => {
  return (
    <>
      <Navbar />
      
      <main className='absolute flex items-center justify-center font-bold w-full min-h-full'>
          <span className='text-center'>
          <h1 className='text-xl md:text-6xl'>Hello this is my CRUD Project  {''}</h1>
          <p className='text-xl md:text-6xl'>and Authentication!</p>
          </span>
      </main>
    </>
  )
}

export default Home
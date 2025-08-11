import { } from 'react'
import userPng from '../../../public/images/icon_student.png'
import LogoutButton from '../../components/UI/Buttons/LogoutButton'
import { useAuthStore } from '../../stores/authStore'

const UsersHomePage = () => {
  const { user } = useAuthStore();
  const fullName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim();

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="flex items-center justify-center flex-col space-y-4">
        <div>
          <img src={userPng} alt="Profile" className="w-52 h-52" />
        </div>

        <div className='text-3xl'>
          <span className='flex gap-2 items-center justify-center'>
            <h1 className='font-semibold'>Username: </h1>
            <p className='font-light'>{ user?.userUsername }</p>
          </span>
          <span className='flex gap-2 items-center justify-center'>
            <h1 className='font-semibold'>Email: </h1>
            <p className='font-light'>{ user?.userEmail }</p>
          </span>
          <span className='flex gap-2 items-center justify-center'>
            <h1 className='font-semibold'>Name: </h1>
            <p className='font-light'>{fullName || 'No name'}</p>
          </span>
        </div>

        <LogoutButton 
          className='px-4 py-2 w-full bg-red-500 rounded-md text-white hover:bg-red-700 transform duration-300'
        />

      </div>
    </main>
  )
}

export default UsersHomePage
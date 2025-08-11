import { } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema as schema } from "../schemas/loginSchema";
import type { LoginSchema } from '../schemas/loginSchema';
import Inputs from '../components/UI/FormInput/Inputs';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
      resolver: zodResolver(schema),
    });

  const onSubmit = async (data: LoginSchema) => {
    const { success, message, error } = await login(
      data.identifier,
      data.password,
    );

    if (success) {
      toast.success(message);
      navigate("/pages/home")
    } else {
      toast.error(error ?? "Login failed");
    }
  };

  return (
    <main className='min-h-screen flex'>
      <div
        className='hidden md:flex w-1/2 bg-cover bg-center'
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1746933075302-e88d565d4189?q=80&w=1974&auto=format&fit=crop')",
        }}
      >
        <div className='bg-black/50 w-full h-full flex flex-col justify-center items-center p-8'>
          <h1 className='text-white text-4xl font-bold mb-4'>Welcome Back!</h1>
          <p className='text-white max-w-sm text-center'>
            Sign in to continue accessing your account.
          </p>
        </div>
      </div>

      <div className='flex w-full md:w-1/2 justify-center items-center bg-white px-8'>
        <form onSubmit={handleSubmit(onSubmit)} className='max-w-md w-full space-y-6' noValidate>
          <h2 className='text-3xl font-bold text-gray-900 text-center'>Sign In</h2>

          <Inputs
            id='identifier'
            label='Email or username'
            type='text'
            placeholder='example@mail.com or example'
            required
            error={errors.identifier?.message}
            register={register('identifier')}
          />

          <Inputs
            id='password'
            label='Password'
            type='password'
            placeholder='••••••'
            required
            error={errors.password?.message}
            register={register('password')}
          />

          <button
            type='submit'
            disabled={isSubmitting}
            className='w-full py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition disabled:opacity-50'
          >
            {isSubmitting ? 'Loading...' : 'Login'}
          </button>

          <p className='text-center text-sm text-gray-600'>
            Don&apos;t have an account?{' '}
            <a
              href='/register'
              className='text-indigo-600 hover:text-indigo-800 font-medium'
            >
              Register
            </a>
          </p>
        </form>
      </div>
    </main>
  );
};

export default Login;

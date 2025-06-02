import { } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema as schema } from "../schemas/registerSchema";
import type { RegisterSchema } from "../schemas/registerSchema";
import Inputs from '../components/UI/FormInput/Inputs';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const { register: signup } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: RegisterSchema) => {
    const { success, message, error } = await signup(
      data.firstName,
      data.lastName,
      data.email,
      data.password,
      "user"
    );

    if (success) {
      toast.success(message);
      navigate("/login");
    } else {
      toast.error(error || "Registration failed");
    }
  };

  return (
    <main className='min-h-screen flex'>
      {/* Left Side Image */}
      <div
        className='hidden md:flex w-1/2 bg-cover bg-center'
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1746933075302-e88d565d4189?q=80&w=1974&auto=format&fit=crop')",
        }}
      >
        <div className='bg-black/50 w-full h-full flex flex-col justify-center items-center p-8'>
          <h1 className="text-white text-4xl font-bold mb-4">Welcome to Our Community</h1>
          <p className="text-white max-w-sm text-center">Join us today and explore the endless possibilities!</p>
        </div>
      </div>

      {/* Register Form */}
      <div className='flex w-full md:w-1/2 justify-center items-center bg-white px-8'>
        <form onSubmit={handleSubmit(onSubmit)} className='max-w-md w-full space-y-6' noValidate>
          <h2 className='text-3xl font-bold text-gray-900 text-center'>Create Account</h2>

          <Inputs
            id='firstName'
            label='First Name'
            placeholder='Your First Name'
            required
            register={register('firstName')}
            error={errors.firstName?.message}
          />
          <Inputs
            id='lastName'
            label='Last Name'
            placeholder='Your Last Name'
            required
            register={register('lastName')}
            error={errors.lastName?.message}
          />
          <Inputs
            id='email'
            label='Email'
            type='email'
            placeholder='example@mail.com'
            required
            register={register('email')}
            error={errors.email?.message}
          />
          <Inputs
            id='password'
            label='Password'
            type='password'
            placeholder='••••••'
            required
            register={register('password')}
            error={errors.password?.message}
          />
          <Inputs
            id='ConfirmPassword'
            label='Confirm Password'
            type='password'
            placeholder='••••••'
            required
            register={register('ConfirmPassword')}
            error={errors.ConfirmPassword?.message}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition"
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>

          <p className="text-center text-sm text-gray-600">
            You have an account?{" "}
            <a href="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Login
            </a>
          </p>
        </form>
      </div>
    </main>
  );
};

export default RegisterPage;

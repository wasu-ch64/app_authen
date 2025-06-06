import { useState } from 'react';
import { Eye, EyeOff, CircleAlert } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";

type FormInputsProps = {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  register: UseFormRegisterReturn;
};

const Inputs = ({ id, label, type = "text", placeholder, required, error, register }: FormInputsProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  let inputType: string;

  if (isPassword) {
      inputType = showPassword ? 'text' : 'password';
  } else {
      inputType = type;
  }

  return (
    <section>
      <label htmlFor={id} className='block text-sm font-medium text-gray-600'>
        {label}
      </label>

      <div className='relative'>
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          {...register}
          required={required}
          className={`block w-full py-3 px-3 pr-12 border rounded-md shadow-sm
            focus:outline-none focus:ring-1 focus:border-indigo-400 ${
            error ? 'border-red-500' : 'border-gray-300'}
          `}
        />

        {isPassword && (
          <button
            type='button'
            tabIndex={-1}
            onClick={() => setShowPassword((prev) => !prev)}
            className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 ${
              error ? 'right-10' : ''}`}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}

        {error && (
          <div className="text-red-500 absolute right-3 top-1/2 -translate-y-1/2">
            <CircleAlert size={22} />
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-sm font-semibold"> {error}! </p>}
    </section>
  );
};

export default Inputs;

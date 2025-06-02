import React, {  } from 'react';
import type { User } from '../../../types/User';
import type { EditUserInput } from '../../../schemas/editUserSchema';
import Inputs from '../../../components/UI/FormInput/Inputs';
import type { UseFormRegister } from 'react-hook-form';

type EditUserModalProps = {
  user: User;
  onClose: () => void;
  onSave: React.FormEventHandler<HTMLFormElement>;
  register: UseFormRegister<EditUserInput>;
  serverError?: string | null;
  errors: {
    [key in keyof EditUserInput]?: {
      message?: string;
    };
  };
};

export const EditUserModal = ({ user, onClose, onSave, register, errors, serverError }: EditUserModalProps) => {

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">Edit User: {user.username}</h2>
        <form onSubmit={onSave} noValidate className="space-y-4">

          <Inputs
            id="firstName"
            label="First Name"
            placeholder="Enter first name"
            register={register("firstName")}
            error={errors.firstName?.message}
          />

          <Inputs
            id="lastName"
            label="Last Name"
            placeholder="Enter last name"
            register={register("lastName")}
            error={errors.lastName?.message}
          />

          <Inputs
            id="username"
            label="Username"
            placeholder="Enter username"
            register={register("username")}
            error={errors.username?.message}
          />

          <Inputs
            id="email"
            label="Email"
            type="email"
            placeholder="Enter email"
            register={register("email")}
            error={errors.email?.message}
          />

          {serverError && (
            <p className="text-red-600 text-sm text-center">{serverError}</p>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

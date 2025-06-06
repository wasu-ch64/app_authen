import { useEffect, useState } from 'react';
import LogoutButton from '../../components/UI/Buttons/LogoutButton';
import { Pencil, Trash2 } from 'lucide-react';
import { useUserStore } from '../../stores/userStroe';
import { toast } from 'react-toastify';
import { EditUserModal } from './Dialog/EditUserModal';
import type { User } from '../../types/User';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { editUserSchema } from "../../schemas/editUserSchema";
import type { EditUserInput } from "../../schemas/editUserSchema";

const Dashboard = () => {
  const { users, getUser, isLoading, error, deleteUser, updateUser } = useUserStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<EditUserInput>({
    resolver: zodResolver(editUserSchema),
  });
  const [serverError, setServerError] = useState<string | null>(null);


  useEffect(() => {
    getUser();
  }, [getUser]);

  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.toLowerCase();
    const email = (user.email ?? '').toLowerCase();
    const role = (user.role ?? '').toLowerCase();
    const term = searchTerm.toLowerCase();

    return (fullName.includes(term) ?? email.includes(term) ?? role.includes(term));
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const result = await deleteUser(id);

      if (result.success) {
        toast.success(result.message ?? 'Delete successful');
        await getUser(); // รีเฟรชข้อมูลหลังลบสำเร็จ
      } else {
        toast.error(result.error ?? 'Delete failed');
      }
    }
  };

  useEffect(() => {
    if (editingUser) {
      reset({
        firstName: editingUser.firstName ?? '',
        lastName: editingUser.lastName ?? '',
        username: editingUser.username ?? '',
        email: editingUser.email ?? '',
      });
    }
  }, [editingUser, reset]);

  const closeModal = () => setEditingUser(null);
  
  const handleSave = async (updatedData: Partial<User>) => {
    if (!editingUser) return;

    setServerError(null);

    const result = await updateUser(editingUser.id, updatedData);
    if (result.success) {
      toast.success(result.message ?? 'Update successful');
      await getUser();
      closeModal();
    } else {
       setServerError(result.error ?? 'Failed to update user');
    }
  };
  const handleEditClick = (user: User) => {
    setEditingUser(user);
  };

  return (
    <div className="p-8">
      <div className='flex justify-between items-center mb-4'>
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <LogoutButton
          className='bg-red-500 px-3 py-2 rounded-md text-base text-white hover:bg-red-600 transform duration-300'
        />
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name, email or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3" scope="col" >#</th>
              <th className="px-6 py-3" scope="col" >Name</th>
              <th className="px-6 py-3" scope="col" >Email</th>
              <th className="px-6 py-3" scope="col" >Role</th>
              <th className="px-6 py-3" scope="col" >createdAt</th>
              <th className="px-6 py-3" scope="col" >Edit</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={6}>Loading users...</td></tr>}
            {error && !isLoading &&
              <tr>
                <td colSpan={6} className="text-red-500">{error}</td>
              </tr>
            }
            {filteredUsers.length === 0 && !isLoading && (
              <tr>
                <td colSpan={6} className="text-center text-lg font-semibold">No users found.</td>
              </tr>
            )}
            {filteredUsers.map(user => {
              const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
              const date = new Date(user.createdAt).toLocaleDateString('en-CA');

              return (
                <tr
                  key={user.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
                >
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.id}</th>
                  <td className="px-6 py-2">
                    {fullName ?? 'No name'}
                  </td>
                  <td className="px-6 py-2">
                    {user.email ?? 'No email'}
                  </td>
                  <td className={`px-6 py-2 ${user.role === 'admin' ? 'text-green-500' : 'text-blue-500'}`}>
                    {user.role ?? 'User'}
                  </td>
                  <td className="px-6 py-2">
                    {date ?? 'No username'}
                  </td>
                  <td className="px-6 py-2 flex gap-2">
                    <button
                      onClick={() => handleEditClick(user)}
                      className="flex gap-2 items-center bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition duration-300"
                    >
                      <Pencil size={12} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="flex gap-2 items-center bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition duration-300"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {editingUser && (
          <EditUserModal
            user={editingUser}
            onClose={closeModal}
            onSave={handleSubmit(handleSave)}
            register={register}
            errors={errors}
            serverError={serverError}
          />

        )}
      </div>
    </div>
  );
};

export default Dashboard;

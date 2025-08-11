import { create } from "zustand";
import { axiosInstance } from "../utils/axios";
import axios from "axios";
import type { User } from '../types/User';

interface UserState {
    users: User[];
    isLoading: boolean,
    error: string | null;
    getUser: () => Promise<{ success: boolean; message?: string; error?: string }>;
    updateUser: (id: string,data: Partial<User>) => Promise<{ success: boolean; message?: string; error?: string }>;
    deleteUser: (id: string) => Promise<{ success: boolean; message?: string; error?: string; }>;
}

export const useUserStore = create<UserState>((set, get) => ({
    users: [],
    isLoading: false,
    error: null,

    getUser: async () => {
        set({ isLoading: true, error: null });

        try {
            const response = await axiosInstance.get('/get-alluser');
            set({ users: response.data.users, isLoading: false });

            return { success: true, message: "User fetched successfully" };
        } catch (error: unknown) {
            let message = 'Get user failed';
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                message = error.response.data.message;
            }

            set({ isLoading: false, error: message });

            return { success: false, error: message };
        }
    },

    deleteUser: async (id) => {
        set({ isLoading: true, error: null });

        try {
            const response = await axiosInstance.delete(`/users/${id}`);

            await get().getUser();

            const message: string = response.data.message ?? "Registration successful";
            set({ isLoading: false });

            return { success: true, message }
        } catch (error: unknown) {
            let message = 'Delete user failed';
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                message = error.response.data.message;
            }

            set({ isLoading: false, error: message });

            return { success: false, error: message };
        }
    },

    updateUser: async (id, data) => {
        set({ isLoading: true, error: null });

        try {
            const response = await axiosInstance.put(`/users/${id}`, data);
            const message = response.data.message ?? 'Update successful';
            await get().getUser();

            set({ isLoading: false, error: null });
            
            return { success: true, message };
        } catch (error: unknown) {
            let message = 'Update user failed';
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                message = error.response.data.message;
            }

            set({ isLoading: false, error: message });

            return { success: false, error: message };
        }
    }

}));
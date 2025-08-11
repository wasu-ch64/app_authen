import { create } from "zustand";
import { axiosInstance } from "../utils/axios";
import axios from "axios";
import type { User } from '../types/User';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    register: ( firstName: string, lastName: string, email: string, password: string, role: string ) => Promise<{ success: boolean; message?: string; error?: string }>;
    login: ( identifier: string, password: string ) => Promise<{ success: boolean; message?: string; error?: string; }>;
    logout: () => Promise<{ success: boolean; message?: string; error?: string }>;
    checkSession: () => Promise<{ success: boolean; error?: string }>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    register: async (firstName, lastName, email, password, role) => {
        set({ isLoading: true, error: null });

        try {
            const response = await axiosInstance.post('/auth/register', {
                firstName,
                lastName,
                email,
                password,
                role,
            });

            const user: User = response.data.user;
            const message: string = response.data.message ?? "Registration successful";
            set({
                user,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            });

            return { success: true, message };
        } catch (error: unknown) {
            let message = 'Registration failed';
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                message = error.response.data.message;
            }
            set({
                isLoading: false,
                error: message,
            });

            return { success: false, error: message };
        }
    },

    login: async ( identifier, password) => {
        set({ isLoading: true, error: null });

        try {
            const response = await axiosInstance.post('/auth/login', {
                identifier,
                password,
            });
        
        const user: User = response.data.user;
        const message: string = response.data.message ?? "Login successful";
        set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
        })
        
        return { success: true, message };
        } catch (error: unknown) {
            let message = 'Login failed';
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                message = error.response.data.message;
            }
            set({
                isLoading: false,
                error: message,
            });

            return { success: false, error: message };
        }
    },

    checkSession: async () => {
        set({ isLoading: true, error: null });

        try {
            const response = await axiosInstance.get('/auth/check-auth');
            const { user } = response.data;

            if (user.userRole === 'guest') {
                set({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: null,
                });
            } else {
                set({
                    user,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null,
                });
            }

            return { success: true };
        } catch (error: unknown) {
            let message = 'checkSession failed';
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                message = error.response.data.message;
            }
            set({ isLoading: false, error: message });

            return { success: false, error: message };
        }
    },

    logout: async () => {
        set({ isLoading: true, error: null });

        try {
            const response = await axiosInstance.post('/auth/logout');
            
            set({
                user: null,
                isLoading: false,
                isAuthenticated: false,
                error: null,
            });

            const message: string = response.data.message ?? "Login successful";

            return { success: true, message };
        } catch (error: unknown) {
            let message = 'Logout failed';
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                message = error.response.data.message;
            }
            set({ isLoading: false, error: message });

            return { success: false, error: message };
        }
    },
}));
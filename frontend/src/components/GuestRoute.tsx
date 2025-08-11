import { useEffect } from "react";
import { useNavigate } from "react-router-dom";  
import { useAuthStore } from '../stores/authStore';
import type { ReactNode } from 'react';

interface GuestRouteProps {
  children: ReactNode;
}

export default function GuestRoute({ children }: GuestRouteProps) {
    const { isAuthenticated, user, checkSession } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        const verifySession = async () => {
            try {
                await checkSession();
            } catch (error: unknown) {
                console.error('GuestRoute session check failed:', error);
            }
        };
        verifySession();
    }, [checkSession]);

    useEffect(() => {
        if (isAuthenticated && user) {
            if (user.userRole === 'admin') {
                navigate('/dashboard', { replace: true });
            } else if (user.userRole === 'user') {
                navigate('/pages/home', { replace: true });
            }
        }
    }, [isAuthenticated, user, navigate]);

    return (!isAuthenticated || user?.userRole === 'guest') ? children : null;

}
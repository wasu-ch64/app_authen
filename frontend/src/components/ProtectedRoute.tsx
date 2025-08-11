import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";  
import { useAuthStore } from '../stores/authStore';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, user, checkSession } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const verifySession = async () => {
            try {
                await checkSession();
            } catch (error: unknown) {
                console.error('ProtectedRoute session check failed:', error);
                navigate('/login', { replace: true });
            }
        };
        verifySession();
    }, [checkSession, navigate]);

    useEffect(() => {
        if (!isAuthenticated || !user || user.userRole === 'guest') {
            navigate('/login', { replace: true });
            return;
        }

        const adminPaths = ['/dashboard', '/admin'];
        const userPaths = ['/home', '/pages'];

        const isAdminPath = adminPaths.some((path) => location.pathname.startsWith(path));
        const isUserPath = userPaths.some((path) => location.pathname.startsWith(path));

        if (user.userRole === 'guest') {
            if (isAdminPath || isUserPath) {
                navigate('/login', { replace: true });
            }
        } else if (user.userRole === 'user' && isAdminPath) {
            navigate('/pages/home', { replace: true });
        } else if (user.userRole === 'admin' && isUserPath) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, user, location, navigate]);

    // แสดง children เฉพาะเมื่อล็อกอินและไม่ใช่ guest เท่านั้น
    return isAuthenticated && user?.userRole !== 'guest' ? children : null;
}

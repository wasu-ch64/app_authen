import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../stores/authStore";
import { toast } from "react-toastify";

interface LogoutButtonProps {
    readonly className?: string;
    readonly children?: React.ReactNode;
}


export default function LogoutButton({ className, children }: LogoutButtonProps) {
    const { logout, isLoading } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        const { success, error, message } = await logout();
        if (success) {
            toast.success(message);
            navigate('/login');
        } else {
            toast.error(error ?? "Logout failed");
        }
    };

    return (
        <button
            onClick={handleLogout}
            disabled={isLoading}
            className={`${className} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {isLoading ? 'Logging out...' : children ?? 'Logout'}
        </button>
    );
}

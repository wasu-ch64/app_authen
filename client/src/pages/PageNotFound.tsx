import {} from 'react';
import { useNavigate } from 'react-router-dom';
import Illustration from '../../public/Error-404-01.svg'

const PageNotFound = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1); // ย้อนกลับไปยังหน้าเดิม
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 p-4">
            <div className="text-center space-y-6 max-w-lg">
                <h1 className="text-8xl font-bold text-gray-800 animate-bounce">404</h1>
                <h2 className="text-3xl font-semibold text-gray-700">Page Not Found</h2>
                <p className="text-gray-500 text-lg">
                 Oops! The page you're looking for doesn't exist or has been moved.
                </p>
                <button
                    onClick={handleBack}
                    className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-300 transform hover:-translate-y-1"
                >
                    กลับหน้าก่อนหน้า
                </button>
                <div className="mt-8">
                    <img
                        src={Illustration}
                        alt="Lost Illustration"
                        className="mx-auto w-64 h-64 object-cover rounded-lg animate-pulse"
                    />
                </div>
            </div>
        </div>
    );
};

export default PageNotFound;
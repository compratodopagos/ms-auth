import { useState } from "react";
import { Login } from "../../application/usecases";
import { AuthAmplifyRepository } from "../../infrastructure/repositories";
import { AuthController } from "../controllers";
import { useNavigate } from "react-router-dom";

const authRepo = new AuthAmplifyRepository();
const loginUser = new Login(authRepo);
const authController = new AuthController(loginUser);

export const useAuthController = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async ({ email, password }: { email: string, password: string }) => {
        try {
            setLoading(true);
            setError(null);
            const { success, message, status } = await authController.handleLogin(email, password);
            if(!success){
                setError(message);
            }
            if(status !== 'active'){
                navigate('/register/steps')
            }
            setLoading(false);
        } catch (err) {
            console.log('err', err)
            setError("Credenciales inválidas");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, login };
};
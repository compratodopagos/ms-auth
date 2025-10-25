import { useAuthIframe } from "../hooks";

const AuthIframe = ({
    redirect = false,
    origin = "https://auth.compratodo.com/silent-login"
}) => {
    const {} = useAuthIframe({ redirect, origin })
    return (
        <iframe src={origin} style={{ display: 'none' }}></iframe>
    );
}

export default AuthIframe;
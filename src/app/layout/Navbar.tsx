import { Link } from "@compratodo/ui-components";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
    const navigate = useNavigate();
    return (
        <header className="flex justify-between items-center">
            <Link href="#" onClick={() => navigate('/')}>
                <img src="images/logo.svg" alt="logo" className="h-8" />
            </Link>
            <nav className="flex gap-4 text-sm">
                <a href="/">Inicio</a>
                <a href="/help">Ayuda</a>
            </nav>
        </header>
    );
}
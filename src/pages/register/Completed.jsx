import { Button, Card } from "@compratodo/ui-components";
import { Link } from "react-router-dom";

const Completed = () => {

    return (
        <div className={`text-center w-full`}>
            <Card title="" className="flex min-h-[300px] justify-center items-center">
                <div className="flex">
                    <div className={`text-center`}>
                        <div className="flex justify-center">
                            <h2 className="max-w-[300px]">¡Gracias por Configurar Tu Cuenta!</h2>
                        </div>
                        <div className="max-w-[650px] text-primary text-sm leading-4 mb-8 mt-3">
                            Tu cuenta ha sido configurada exitosamente. Ahora podrás disfrutar de una experiencia optimizada y protegida para manejar tus pagos y transacciones.
                        </div>
                        <div className="flex justify-center">
                            <Link to="/home">
                                <Button className="w-[135px] h-[45px]">
                                    <div className="text-sm">
                                        Iniciar Sesión
                                    </div>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Completed;
export const LoginAside = () => {
    return (
        <div className='p-4 right'>
            <div className="block bg-primary rounded-lg">
                <div className="info">
                    <div className="flex justify-end">
                        <img src="/images/logo.png" width={283} />
                    </div>
                    <div className="mt-4 flex flex-wrap justify-end">
                        <label className='title text-white mb-4'>La forma más segura y rápida de gestionar tus pagos</label>
                        <p className='ps-3 text-white'>Con nuestra plataforma, puedes realizar transacciones, monitorear tu historial de pagos y mucho más. </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
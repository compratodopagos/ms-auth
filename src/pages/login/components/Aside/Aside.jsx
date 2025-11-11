import styles from './Aside.module.css'
import { LogoIcon } from '../../../../icons/LogoIcon'

export const Aside = () => {
    return (
        <div className={`${styles.right} p-4`}>
            <div className={`${styles.block} bg-primary rounded-lg`}>
                <div className={`${styles.info}`}>
                    <div className="flex justify-end">
                        <LogoIcon className='w-[283px]'/>
                    </div>
                    <div className="mt-4 flex flex-wrap justify-end">
                        <label className={`title text-white mb-4`}>La forma más segura y rápida de gestionar tus pagos</label>
                        <p className='ps-3 text-white'>Con nuestra plataforma, puedes realizar transacciones, monitorear tu historial de pagos y mucho más. </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
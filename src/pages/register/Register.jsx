import styles from "./Register.module.css";
import { Navbar } from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Outlet } from 'react-router-dom';

const RegisterPage = () => {
  return (
    <div className={`${styles.RegisterLayout} p-4`}>
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RegisterPage;
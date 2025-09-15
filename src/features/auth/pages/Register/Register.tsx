import './Register.css';
import { Navbar } from '../../../../app/layout/Navbar';
import { MainRegister } from '../../components/MainRegister';
import Footer from '../../../../app/layout/Footer';

const RegisterPage = () => {
  return (
    <div className='RegisterLayout p-4'>
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        <MainRegister />
      </main>
      <Footer />
    </div>
  );
};

export default RegisterPage;
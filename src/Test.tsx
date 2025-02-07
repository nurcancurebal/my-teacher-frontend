import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';

function App() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const notify = () => toast.error('🦄 Wow so easy!', {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });

  return (
    <>
      <h1>{t('WELCOME_TO_REACT')}</h1>
      <button onClick={notify}>Notify!</button>
      <button onClick={() => changeLanguage('en')}>English</button><br />
      <button onClick={() => changeLanguage('de')}>Deutsch</button><br />
      <button onClick={() => changeLanguage('tr')}>Turkish</button>

      <ToastContainer />
    </>
  );
}

export default App;

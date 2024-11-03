import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/Routes";
import { AuthProvider } from "./contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { Bounce, ToastContainer } from "react-toastify";
import store from "./store/store";
import { Provider } from "react-redux";
import { FileProvider } from "./contexts/FileContext";
import "./i18n";
import { PlatformsProvider } from "./contexts/PlatformsContext";
import { WhatsAppProvider } from "./contexts/WhatsappContext";

function App() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.body.setAttribute("dir", lng === "ar" ? "rtl" : "ltr");
  };

  return (
    <Provider store={store}>
      <Router>
        <AuthProvider>
          <WhatsAppProvider>
            <PlatformsProvider>
              <FileProvider>
                {/* <h1>{t("welcome")}</h1>
        <button onClick={() => changeLanguage("en")}>English</button>
        <button onClick={() => changeLanguage("ar")}>عربي</button> */}
                <AppRoutes />
              </FileProvider>
            </PlatformsProvider>
          </WhatsAppProvider>
        </AuthProvider>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
      </Router>
    </Provider>
  );
}

export default App;

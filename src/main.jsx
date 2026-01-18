import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import App from "./App.jsx";
import { ThemeToggleProvider } from "./context/ThemeContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { DataProvider } from "./context/DataContext.jsx";
import { GlobalStyle } from "./styles/GlobalStyles.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeToggleProvider>
      <AuthProvider>
        <DataProvider>
          <GlobalStyle />
          <BrowserRouter>
            <App />
          </BrowserRouter>

          <ToastContainer
            position="top-right"
            autoClose={2200}
            pauseOnHover
            closeOnClick
            theme="colored"
          />
        </DataProvider>
      </AuthProvider>
    </ThemeToggleProvider>
  </React.StrictMode>
);

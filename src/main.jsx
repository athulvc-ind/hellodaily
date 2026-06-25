import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import { ZedProvider } from "./state/ZedContext.jsx";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ZedProvider>
        <App />
      </ZedProvider>
    </BrowserRouter>
  </React.StrictMode>
);

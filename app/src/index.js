import ReactDOM from "react-dom/client";

/* ====== CSS ====== */
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

/* ====== JS ====== */
import "bootstrap/dist/js/bootstrap.bundle.min";

/* ====== Applications ====== */
import App from "./app";
// import App from "./app.test";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

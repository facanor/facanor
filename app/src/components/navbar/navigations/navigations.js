/* ====== CSS ====== */
import "./navigations.css";

/* ====== Components ====== */
import Options from "../utils/options";

/* ====== Contexts ====== */
import { useToggleContext } from "../../../contexts/ToggleContext";

const Navigations = () => {
    const { showNavTools, setShowNavTools, showNavTable, setShowNavTable } =
        useToggleContext();

    return (
        <li className="nav-li">
            <button
                type="button"
                className="btn btn-default"
                title="Navegaciones"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                <p className="navbar-p">Navegaciones</p>
            </button>
            <ul className="dropdown-menu">
                <Options
                    name="Barra de Herramientas"
                    state={showNavTools}
                    toggleFunction={setShowNavTools}
                />
                <Options
                    name="Tabla de Navegaciones"
                    state={showNavTable}
                    toggleFunction={setShowNavTable}
                />
            </ul>
        </li>
    );
};

export default Navigations;

/* ====== CSS ====== */
import "./annotations.css";

/* ====== Components ====== */
import Options from "../utils/options";

/* ====== Contexts ====== */
import { useToggleContext } from "../../../contexts/ToggleContext";

const Annotations = () => {
    const { showAnnotTools, setShowAnnotTools, showAnnotTable, setShowAnnotTable } =
        useToggleContext();

    return (
        <li className="nav-li">
            <button
                type="button"
                className="btn btn-default"
                title="Anotaciones"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                <p className="navbar-p">Anotaciones</p>
            </button>
            <ul className="dropdown-menu">
                <Options
                    name="Barra de Herramientas"
                    state={showAnnotTools}
                    toggleFunction={setShowAnnotTools}
                />
                <Options
                    name="Tabla de Anotaciones"
                    state={showAnnotTable}
                    toggleFunction={setShowAnnotTable}
                />
            </ul>
        </li>
    );
};

export default Annotations;

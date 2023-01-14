/* ====== CSS ====== */
import "./automate.css";

/* ====== Components ====== */
import Options from "../utils/options";

const Automate = () => {
    return (
        <li className="nav-li">
            <button
                type="button"
                className="btn btn-default"
                title="Análisis"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                <p className="navbar-p">Análisis</p>
            </button>
            <ul className="dropdown-menu">
                <Options name="Filtros" disabled={true} />
                <Options name="Gráficas" disabled={true} />
                <Options name="Macros" disabled={true} />
                <Options name="Plugins" disabled={true} />
            </ul>
        </li>
    );
};

export default Automate;

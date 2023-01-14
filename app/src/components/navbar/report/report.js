/* ====== CSS ====== */
import "./report.css";

/* ====== Components ====== */
import Options from "../utils/options";

/* ====== Contexts ====== */
import { useToggleContext } from "../../../contexts/ToggleContext";

const Report = () => {
    const { showReport, setShowReport } = useToggleContext();
    return (
        <li className="nav-li">
            <button
                type="button"
                className="btn btn-default"
                title="Reporte"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                <p className="navbar-p">Reporte</p>
            </button>
            <ul className="dropdown-menu">
                <Options name="Nuevo Reporte" disabled={true} />
                <Options
                    name="Ver Reporte"
                    state={showReport}
                    toggleFunction={setShowReport}
                />
            </ul>
        </li>
    );
};

export default Report;

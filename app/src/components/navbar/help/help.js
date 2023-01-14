/* ====== CSS ====== */
import "./help.css";

/* ====== Components ====== */
import Options from "../utils/options";

const Help = () => {
    return (
        <li className="nav-li">
            <button
                type="button"
                className="btn btn-default"
                title="Ayuda"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                <p className="navbar-p">Ayuda</p>
            </button>
            <ul className="dropdown-menu">
                <Options name="Tutoriales" disabled={true} />
                <Options name="Documentación" disabled={true} />
                <hr />
                <Options name="Licencia" disabled={true} />
                <Options name="Acerca de" disabled={true} />
            </ul>
        </li>
    );
};

export default Help;

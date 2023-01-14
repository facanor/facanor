/* ====== CSS ====== */
import "./patients.css";

/* ====== Components ====== */
import Options from "../utils/options";

const Patients = () => {
    return (
        <li className="nav-li">
            <button
                type="button"
                className="btn btn-default"
                title="Estudio"
                data-bs-toggle="dropdown"
                data-bs-auto-close="outside"
                aria-expanded="false"
            >
                <p className="navbar-p">Estudio</p>
            </button>
            <ul className="dropdown-menu">
                <Options name="Nuevo" disabled={true} />
                <Options name="Paciente" disabled={true} />
                <hr />
                <div className="dropend">
                    <button
                        type="button"
                        className="btn btn-default dropdown-toggle"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <p className="navbar-p">Imágenes</p>
                    </button>
                    <ul className="dropdown-menu">
                        <Options name="Microscopía" disabled={true} />
                        <Options name="Macroscopía" disabled={true} />
                        <Options name="Radiología" disabled={true} />
                    </ul>
                </div>
            </ul>
        </li>
    );
};

export default Patients;

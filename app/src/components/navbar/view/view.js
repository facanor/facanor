/* ====== CSS ====== */
import "./view.css";

/* ====== Components ====== */
import Options from "../utils/options";

const View = () => {
    return (
        <li className="nav-li">
            <button
                type="button"
                className="btn btn-default"
                title="Vista"
                data-bs-toggle="dropdown"
                data-bs-auto-close="outside"
                aria-expanded="false"
            >
                <p className="navbar-p">Vista</p>
            </button>
            <ul className="dropdown-menu">
                <Options name="Pantalla Completa" disabled={true} />
                <Options name="Dividir Pantalla" disabled={true} />
                <hr />
                <div className="dropend">
                    <button
                        type="button"
                        className="btn btn-default dropdown-toggle"
                        data-bs-toggle="dropdown"
                        data-bs-auto-close="outside"
                        aria-expanded="false"
                    >
                        <p className="navbar-p">Mostrar Elementos</p>
                    </button>
                    <ul className="dropdown-menu">
                        <Options name="Mostrar Miniatura" disabled={true} />
                        <Options name="Mostrar Escala" disabled={true} />
                        <Options name="Mostrar Controles" disabled={true} />
                    </ul>
                </div>
            </ul>
        </li>
    );
};

export default View;

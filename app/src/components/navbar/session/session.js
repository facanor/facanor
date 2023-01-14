import { useEffect } from "react";
import axios from "axios";

/* ====== CSS ====== */
import "./session.css";

/* ====== Components ====== */
import Options from "../utils/options";

/* ====== Contexts ====== */
import { useSessionContext } from "../../../contexts/SessionContext";

/* ====== Utils ====== */
import { wellcomeAlert, infoAlert, successAlert } from "../../../utils/alert";

const Session = () => {
    const { inSession, setInSession, session, setSession } = useSessionContext();
    let wellcomeTemplate = null;
    let logoutTemplate = null;

    useEffect(() => {
        if (inSession) {
            if (session.name === "Anónimo") {
                wellcomeTemplate = (
                    <>
                        Estás viendo una demostración de nuestro sistema. Para más
                        información visita el siguiente
                        <a
                            href="https://redpat.unillanos.edu.co/es/inicio"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <strong> enlace</strong>
                        </a>
                        . <br />
                        <span
                            style={{
                                display: "flex",
                                justifyContent: "end",
                                marginTop: "0.5rem",
                            }}
                        >
                            - Equipo{" "}
                            <strong style={{ marginLeft: "0.35rem" }}>RedPat</strong>
                        </span>
                    </>
                );
                wellcomeAlert(
                    <>
                        Bienvenido usuario <strong>{session.name}</strong>.
                    </>,
                    "light",
                    4000,
                    0
                );
                infoAlert(wellcomeTemplate, "light", 10000, 2000);
            } else if (session.name !== "") {
                wellcomeTemplate = (
                    <>
                        Bienvenido usuario <strong>{session.name}</strong>.
                    </>
                );
                wellcomeAlert(wellcomeTemplate, "light", 4000, 0);
            }
        }
    }, [session]);

    const logout = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            var config = {
                method: "post",
                url: "https://177.93.51.13/users/api/v1/logout/",
                headers: {
                    Authorization: `token ${token}`,
                },
                withCredentials: true,
            };

            await axios(config)
                .then(function () {
                    setSession({
                        name: "",
                        rol: "",
                        institution: "",
                    });
                    localStorage.removeItem("token");
                    setInSession(false);
                    logoutTemplate = <>La sesión se ha cerrado correctamente.</>;
                    successAlert(logoutTemplate, "light", 4000, 0);
                })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            setSession({
                name: "",
                rol: "",
                institution: "",
            });
            setInSession(false);
            logoutTemplate = <>La sesión se ha cerrado correctamente.</>;
            successAlert(logoutTemplate, "light", 4000, 0);
        }
    };

    return (
        <div id="session-bar" className="session-bar">
            <ul className="nav-ul">
                <li className="nav-li username">
                    <p className="session-name">
                        <span>{session.name}</span>
                        {inSession ? ": " : null}
                        {session.rol}
                    </p>
                </li>
                <li className="nav-li">
                    <button
                        type="button"
                        className="btn btn-default"
                        title="Sesión"
                        data-bs-toggle="dropdown"
                        data-bs-auto-close="outside"
                        aria-expanded="false"
                    >
                        <i className="fa-solid fa-user-doctor"></i>
                    </button>
                    <ul className="dropdown-menu">
                        <Options name="Perfil" disabled={true} />
                        <Options name="Configuraciones" disabled={true} />
                        {/* <Options
                            name="Cerrar Sesión"
                            state={inSession}
                            toggleFunction={setInSession}
                        /> */}
                        <li className="nav-li">
                            <button
                                type="button"
                                className="btn btn-default"
                                title="Cerrar Sesión"
                                onClick={logout}
                                disabled=""
                            >
                                <p className="navbar-p">Cerrar Sesión</p>
                            </button>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    );
};

export default Session;

import { useEffect } from "react";
import axios from "axios";

/* ====== CSS ====== */
import "./login.css";

/* ====== Contexts ====== */
import { useSessionContext } from "../../contexts/SessionContext";

/* ====== Utils ====== */
import { errorAlert } from "../../utils/alert";

const Login = () => {
    const { inSession, setInSession, setSession } = useSessionContext();
    let errorTemplate = null;

    const demonstration = () => {
        setSession({
            name: "Anónimo",
            rol: "Anónimo",
            institution: "Invitado",
        });
        setInSession(true);
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (inSession || token) {
            requestUserData();
        } else {
            document.getElementById("login-button").click();
        }
    }, [inSession]);

    const login = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem("token");
        if (token) {
            requestUserData();
        } else {
            var data = JSON.stringify({
                username: event.currentTarget.elements.username.value,
                password: event.currentTarget.elements.password.value,
            });

            var config = {
                method: "post",
                url: "https://177.93.51.13/users/api/v1/login/",
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
                data: data,
            };

            await axios(config)
                .then(function (response) {
                    localStorage.setItem("token", response.data.access_token);
                    requestUserData();
                })
                .catch(function (error) {
                    console.log(error);
                    errorTemplate = <>Usuario y contraseña incorrectos.</>;
                    errorAlert(errorTemplate, "light", 5000, 0);
                });
        }
    };

    const requestUserData = async () => {
        const token = localStorage.getItem("token");
        var config = {
            method: "get",
            url: "https://177.93.51.13/users/api/v1/get-userinfo/",
            headers: {
                Authorization: `token ${token}`,
                "Content-Type": "application/json",
            },
            withCredentials: true, // agrega la cookie a la petición
        };

        await axios(config)
            .then(function (response) {
                //console.log(JSON.stringify(response.data));
                document.getElementById("close-modal").click();
                setSession({
                    name: response.data.usuario.persona.nombres,
                    rol: response.data.rol.nombre,
                    institution: response.data.organizacion.nombre,
                });
                setInSession(true);
            })
            .catch(function (error) {
                console.log(error);
                errorTemplate = <>Ha ocurrido un error inesperado.</>;
                errorAlert(errorTemplate, "light", 5000, 0);
            });
    };

    return (
        <>
            <button
                id="login-button"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#login"
                hidden
            ></button>
            <div
                className="modal fade"
                id="login"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                tabIndex="-1"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-fullscreen-sm-down modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1>
                                Iniciar Sesión<span>Confirmar credenciales</span>
                            </h1>
                        </div>
                        <form onSubmit={login}>
                            <div className="modal-body">
                                <div className="form-body">
                                    <div className="form-floating">
                                        <input
                                            className="form-control username"
                                            type="text"
                                            name="username"
                                            placeholder="Nombre de usuario"
                                            required
                                        />
                                        <label className="form-label">Usuario</label>
                                    </div>
                                    <div className="form-floating">
                                        <input
                                            className="form-control password"
                                            type="password"
                                            name="password"
                                            placeholder="Contraseña"
                                            required
                                        />
                                        <label className="form-label">Contraseña</label>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="modal-login-button">
                                    Ingresar
                                </button>
                                <button
                                    type="button"
                                    className="modal-demo-button"
                                    data-bs-dismiss="modal"
                                    onClick={demonstration}
                                >
                                    Demostración
                                </button>
                                <button
                                    type="button"
                                    id="close-modal"
                                    data-bs-dismiss="modal"
                                    hidden
                                ></button>
                                <div className="copyright">
                                    &copy; {new Date().getFullYear()} Desarrollado por
                                    <a
                                        href="https://redpat.unillanos.edu.co/es/inicio"
                                        target="_blank"
                                    >
                                        REDPAT
                                    </a>
                                    .
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;

// import { CKEditor } from "ckeditor4-react";
import { useEffect, useState } from "react";
import axios from "axios";

const Report = () => {
    const loadPersona = async (persona) => {
        const token = localStorage.getItem("token");
        if (token) {
            var config = {
                method: "get",
                url: "https://177.93.51.13/si/api/v1/personas/" + persona + "/",
                headers: {
                    Authorization: `token ${token}`,
                },
                withCredentials: true,
            };

            await axios(config)
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            var config = {
                method: "get",
                url: "https://177.93.51.13/si/api/v1/informes-patologicos/be914215-8835-4ed8-96aa-3a9663053744/",
                //url: "https://177.93.51.13/si/api/v1/estudios-patologicos/be914215-8835-4ed8-96aa-3a9663053744/",
                headers: {
                    Authorization: `token ${token}`,
                },
                withCredentials: true,
            };

            axios(config)
                .then(function (response) {
                    console.log(response);
                    // const persona = response.data.paciente.persona;
                    // loadPersona(persona);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }, []);

    return (
        <div id="div-report" className="div-report container">
            <form>
                <div className="basic-information">
                    <h5>Información básica del caso</h5>
                    <div className="row">
                        <div className="col">
                            <label>Consecutivo</label>
                            <input type="text" value="47845" disabled />
                        </div>
                        <div className="col">
                            <label>Identificación</label>
                            <input type="text" value="80456123" disabled />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <label>Sitio anatómico</label>
                            <input type="text" value="BRE - Mama" disabled />
                        </div>
                        <div className="col">
                            <label>Nombre</label>
                            <input type="text" value="Ana Perez" disabled />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <label>Procedimiento de obtención</label>
                            <input type="text" value="Biopsia" disabled />
                        </div>
                        <div className="col">
                            <label>Edad</label>
                            <input type="text" value="57" disabled />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <label>Prioridad</label>
                            <input type="text" value="Oncológico" disabled />
                        </div>
                        <div className="col">
                            <label>Sexo</label>
                            <input type="text" value="Femenino" disabled />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <label>Estado del caso</label>
                            <input type="text" value="Activo" disabled />
                        </div>
                        <div className="col">
                            <a href={undefined}>Ver detalle</a>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <input type="checkbox" checked={true} readOnly />
                            Caso visto en junta
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <label>
                                <b>Justificación de la realización junta</b>
                            </label>
                            <textarea value="Justificación de prueba" rows="4" disabled />
                        </div>
                    </div>
                    <h5>Datos adjuntos</h5>
                    <div className="row">
                        <div className="col">
                            <table className="table">
                                <thead className="thead-dark">
                                    <tr>
                                        <th scope="col">Tipo</th>
                                        <th scope="col">Nombre</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Reporte de patología externo</td>
                                        <td>
                                            <a href={undefined}>Documento</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Reporte de segunda opinión</td>
                                        <td>
                                            <a href={undefined}>Documento</a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="report-information">
                    <h5>Reporte</h5>
                    <div className="row">
                        <div className="col">
                            <label>
                                <b>Diagnóstico clínico</b>
                            </label>
                            <textarea value="Diagnóstico de prueba" rows="4" disabled />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <label>
                                <b>Descripción macroscópica</b>
                            </label>
                            <label className="label-required">
                                Este campo es obligatorio
                            </label>
                            <textarea
                                value="Rotulado Mama - En formol se recibe muestra de tejido de Mama de color x que mide x ..."
                                rows="4"
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <label>
                                <b>Descripción microscópica</b>
                            </label>
                            <label className="label-required">
                                Este campo es obligatorio
                            </label>
                            <textarea placeholder="Escriba la descripción ..." rows="4" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <label>
                                <b>Diagnósticos patológicos</b>
                            </label>
                            <label className="label-required">
                                Este campo es obligatorio
                            </label>
                            <textarea
                                placeholder="Escriba los diagnósticos patológicos ..."
                                rows="4"
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <label>
                                <b>Comentarios</b>
                            </label>
                            <label>Generar plantilla</label>
                            <input type="text" placeholder="Buscar" />
                            {/* <textarea
                                placeholder="Escriba los comentarios ..."
                                rows="4"
                            /> */}
                            {/* <CKEditor
                                initData="<p>Hello from CKEditor 4!</p>"
                                editorUrl="/ckeditor/ckeditor.js"
                                onInstanceReady={() => {
                                    console.log("Editor is ready!");
                                }}
                            /> */}
                        </div>
                    </div>
                </div>
                <div className="report-buttons">
                    <div className="row">
                        <div className="col">
                            <button type="button" className="btn btn-danger">
                                Cancelar
                            </button>
                        </div>
                        <div className="col">
                            <button type="button" className="btn btn-success">
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Report;

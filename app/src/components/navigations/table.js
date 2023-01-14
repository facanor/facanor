/* ====== CSS ====== */
import "./table.css";

import ToolbarOptions from "../navbar/annotations/utils/toolbarOptions";

const NavigationsTable = () => {
    return (
        <div className="navigations-table table-responsive-md">
            <table className="table align-middle table-bordered table-hover table-sm">
                <thead className="table-dark">
                    <tr>
                        <th scope="col"></th>
                        <th scope="col">Grabación</th>
                        <th scope="col">Tiempo (s)</th>
                        <th scope="col">Comentario</th>
                        <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">
                            <ul className="nav-ul">
                                <li className="nav-li">
                                    <button type="button" className="btn">
                                        <i
                                            className="fas fa-play"
                                            style={{ color: "#df92b5" }}
                                        ></i>
                                    </button>
                                </li>
                            </ul>
                        </th>
                        <td className="cell-center">1</td>
                        <td>35.67</td>
                        <td>Áreas de mitosis</td>
                        <td>
                            <ul className="nav-ul">
                                <ToolbarOptions
                                    name="Reproducir última navegación"
                                    iconClass="fas fa-play"
                                />
                                <ToolbarOptions
                                    name="Exportar navegaciones"
                                    iconClass="far fa-save"
                                />
                                <ToolbarOptions
                                    name="Eliminar"
                                    iconClass="far fa-trash-alt"
                                />
                            </ul>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <ul className="nav-ul">
                                <li className="nav-li">
                                    <button type="button" className="btn">
                                        <i
                                            className="fas fa-play"
                                            style={{ color: "#f11016" }}
                                        ></i>
                                    </button>
                                </li>
                            </ul>
                        </th>
                        <td className="cell-center">2</td>
                        <td>56.2</td>
                        <td>Tejido sano</td>
                        <td>
                            <ul className="nav-ul">
                                <ToolbarOptions
                                    name="Reproducir última navegación"
                                    iconClass="fas fa-play"
                                />
                                <ToolbarOptions
                                    name="Exportar navegaciones"
                                    iconClass="far fa-save"
                                />
                                <ToolbarOptions
                                    name="Eliminar"
                                    iconClass="far fa-trash-alt"
                                />
                            </ul>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <ul className="nav-ul">
                                <li className="nav-li">
                                    <button type="button" className="btn">
                                        <i
                                            className="fas fa-play"
                                            style={{ color: "#10f13f" }}
                                        ></i>
                                    </button>
                                </li>
                            </ul>
                        </th>
                        <td className="cell-center">3</td>
                        <td>16</td>
                        <td>Zona con presencia de linfocitos</td>
                        <td>
                            <ul className="nav-ul">
                                <ToolbarOptions
                                    name="Reproducir última navegación"
                                    iconClass="fas fa-play"
                                />
                                <ToolbarOptions
                                    name="Exportar navegaciones"
                                    iconClass="far fa-save"
                                />
                                <ToolbarOptions
                                    name="Eliminar"
                                    iconClass="far fa-trash-alt"
                                />
                            </ul>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <ul className="nav-ul">
                                <li className="nav-li">
                                    <button type="button" className="btn">
                                        <i
                                            className="fas fa-play"
                                            style={{ color: "#e5f110" }}
                                        ></i>
                                    </button>
                                </li>
                            </ul>
                        </th>
                        <td className="cell-center">4</td>
                        <td>89.5</td>
                        <td>Zona de tejido necrótico</td>
                        <td>
                            <ul className="nav-ul">
                                <ToolbarOptions
                                    name="Reproducir última navegación"
                                    iconClass="fas fa-play"
                                />
                                <ToolbarOptions
                                    name="Exportar navegaciones"
                                    iconClass="far fa-save"
                                />
                                <ToolbarOptions
                                    name="Eliminar"
                                    iconClass="far fa-trash-alt"
                                />
                            </ul>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <ul className="nav-ul">
                                <li className="nav-li">
                                    <button type="button" className="btn">
                                        <i
                                            className="fas fa-play"
                                            style={{ color: "#3f10f1" }}
                                        ></i>
                                    </button>
                                </li>
                            </ul>
                        </th>
                        <td className="cell-center">5</td>
                        <td>123.2</td>
                        <td>Gran área de tumor</td>
                        <td>
                            <ul className="nav-ul">
                                <ToolbarOptions
                                    name="Reproducir última navegación"
                                    iconClass="fas fa-play"
                                />
                                <ToolbarOptions
                                    name="Exportar navegaciones"
                                    iconClass="far fa-save"
                                />
                                <ToolbarOptions
                                    name="Eliminar"
                                    iconClass="far fa-trash-alt"
                                />
                            </ul>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default NavigationsTable;

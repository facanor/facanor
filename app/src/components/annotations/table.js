/* ====== CSS ====== */
import "./table.css";

import ToolbarOptions from "../navbar/annotations/utils/toolbarOptions";

const AnnotationsTable = () => {
    return (
        <div className="annotations-table table-responsive-md">
            <table className="table align-middle table-bordered table-hover table-sm">
                <thead className="table-dark">
                    <tr>
                        <th scope="col"></th>
                        <th scope="col">Región</th>
                        <th scope="col">Etiqueta</th>
                        <th scope="col">Perímetro</th>
                        <th scope="col">Área</th>
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
                        <td>Necrosis</td>
                        <td className="cell-center">78.56 μm</td>
                        <td className="cell-center">195.5 μm</td>
                        <td>Zona de necrosis</td>
                        <td>
                            <ul className="nav-ul">
                                <li className="nav-li">
                                    <button type="button" className="btn">
                                        <i
                                            className="fas fa-square"
                                            style={{ color: "#df92b5" }}
                                        ></i>
                                    </button>
                                </li>
                                <ToolbarOptions
                                    name="Ocultar/Mostrar"
                                    iconClass="far fa-eye"
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
                        <td>Tumor</td>
                        <td className="cell-center">150 μm</td>
                        <td className="cell-center">834 μm</td>
                        <td></td>
                        <td>
                            <ul className="nav-ul">
                                <li className="nav-li">
                                    <button type="button" className="btn">
                                        <i
                                            className="fas fa-square"
                                            style={{ color: "#f11016" }}
                                        ></i>
                                    </button>
                                </li>
                                <ToolbarOptions
                                    name="Ocultar/Mostrar"
                                    iconClass="far fa-eye"
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
                        <td>Estroma</td>
                        <td className="cell-center">23 μm</td>
                        <td className="cell-center">120.9 μm</td>
                        <td>Zona con presencia de linfocitos</td>
                        <td>
                            <ul className="nav-ul">
                                <li className="nav-li">
                                    <button type="button" className="btn">
                                        <i
                                            className="fas fa-square"
                                            style={{ color: "#10f13f" }}
                                        ></i>
                                    </button>
                                </li>
                                <ToolbarOptions
                                    name="Ocultar/Mostrar"
                                    iconClass="far fa-eye"
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
                        <td>Papilar, Micropapilar</td>
                        <td className="cell-center">23.4 μm</td>
                        <td className="cell-center">59.74 μm</td>
                        <td>Zona con células formando papilas</td>
                        <td>
                            <ul className="nav-ul">
                                <li className="nav-li">
                                    <button type="button" className="btn">
                                        <i
                                            className="fas fa-square"
                                            style={{ color: "#e5f110" }}
                                        ></i>
                                    </button>
                                </li>
                                <ToolbarOptions
                                    name="Ocultar/Mostrar"
                                    iconClass="far fa-eye"
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
                        <td>Sano</td>
                        <td className="cell-center">345 μm</td>
                        <td className="cell-center">1254.2 μm</td>
                        <td>Gran zona con sábanas de células sanas</td>
                        <td>
                            <ul className="nav-ul">
                                <li className="nav-li">
                                    <button type="button" className="btn">
                                        <i
                                            className="fas fa-square"
                                            style={{ color: "#3f10f1" }}
                                        ></i>
                                    </button>
                                </li>
                                <ToolbarOptions
                                    name="Ocultar/Mostrar"
                                    iconClass="far fa-eye"
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

export default AnnotationsTable;

/* ====== Hooks ====== */
import React, { useState, useEffect } from "react";
import axios from "axios";
import XMLParser from "react-xml-parser";

import json_annot from "./assets/prueba.json";
import xml_annot from "./assets/prueba.xml";

const App = () => {
    const [XMLElement, setXMLElement] = useState(null);
    const [vertices, setVertices] = useState(null);
    var annot = null;

    axios
        .get(xml_annot, {
            "Content-Type": "application/xml; charset=utf-8",
        })
        .then((response) => {
            // setXMLElement(response.data);
            // console.log(response.data);
            annot = new XMLParser().parseFromString(response.data);
            setXMLElement(JSON.stringify(annot));
        });

    useEffect(() => {
        if (annot != null) {
            console.log(annot.getElementsByTagName("Vertices"));
            setVertices(JSON.stringify(annot.getElementsByTagName("Vertices")));
        }
    }, [annot]);

    return (
        <div className="row">
            <h2 className="text-center">XML a JSON</h2>
            <p className="text-center mt-3">Cantidad de elementos: {json_annot.length}</p>
            <div className="col" style={{ width: "50%" }}>
                <h2 className="text-center">XML</h2>
                <div style={{ height: "28rem", overflowY: "scroll" }}>{XMLElement}</div>
            </div>
            <div className="col" style={{ width: "50%" }}>
                <h2 className="text-center">JSON</h2>
                {/* <ul>
                    {json_annot.map((val) => (
                        <li style={{ wordWrap: "break-word", marginBottom: "2rem" }}>
                            {JSON.stringify(val)}
                        </li>
                    ))}
                </ul> */}
                {vertices}
            </div>
        </div>
    );
};

export default App;

/* ====== Hooks ====== */
import React from "react";

const App = () => {
    const elements = [];
    const xmlelements = [];

    let mpp = 0.4957;
    const ReactDomServer = require("react-dom/server");
    const annot = require("./assets/prueba.json");

    const Annotations = (props) => React.createElement("annotations", props);
    const Annotation = (props) => React.createElement("annotation", props);
    const Attributes = (props) => React.createElement("attributes", props);
    const Regions = (props) => React.createElement("regions", props);
    const RegionAttributeHeaders = (props) =>
        React.createElement("regionattributeheaders", props);
    const Region = (props) => React.createElement("region", props);
    const Vertices = (props) => React.createElement("vertices", props);
    const Vertex = (props) => React.createElement("vertex", props);

    for (let i = 0; i < annot.length; i++) {
        if (annot[i]["type"] == "Annotation") {
            xmlelements.push(
                <Region Id={annot[i]["id"]}>
                    <Attributes></Attributes>
                    <Vertices>
                        {/* <Vertex X="5679.049703" Y="3938.484714" Z="0"/>
                        <Vertex X="7337.166405" Y="3938.484714" Z="0"/>
                        <Vertex X="7337.166405" Y="4933.354735" Z="0"/>
                        <Vertex X="5679.049703" Y="4933.354735" Z="0"/> */}
                    </Vertices>
                </Region>
            );
            // {
            /* {i + 1}: {JSON.stringify(annot[i], null, 4)} */
            // }
            var coords = annot[i]["target"]["selector"];
            if (coords[0] != undefined) {
                if (coords[0]["type"] == "FragmentSelector") {
                    elements.push(JSON.stringify(coords[0]["value"], null, 4));
                }
            }
        }
    }

    const view = ReactDomServer.renderToStaticMarkup(
        <Annotations MicronsPerPixel={mpp}>
            <Annotation>
                <Attributes></Attributes>
                <Regions>
                    <RegionAttributeHeaders></RegionAttributeHeaders>
                    {xmlelements.map((el) => el)}
                </Regions>
            </Annotation>
        </Annotations>
    );

    return (
        <div className="row">
            <h2>XML a JSON</h2>
            <p className="text-center mt-3">Cantidad de elementos: {annot.length}</p>
            <div className="col">
                <h2 className="text-center">JSON</h2>
                <ul>
                    {elements.map((item, index) => (
                        <>
                            <li key={item}>
                                {index}: {item}
                            </li>
                            <br />
                        </>
                    ))}
                </ul>
            </div>
            <div className="col">
                <h2 className="text-center">XML</h2>
                {view}
            </div>
        </div>
    );
};

export default App;

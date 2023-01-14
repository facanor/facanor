import { useState } from "react";
import axios from "axios";

import * as Annotorious from "@recogito/annotorious-openseadragon";
import "@recogito/annotorious-openseadragon/dist/annotorious.min.css";
import * as SelectorPack from "@recogito/annotorious-selector-pack";
// import SelectorPack from "../utils/SelectorPack/index";
import * as BetterPolygon from "@recogito/annotorious-better-polygon";
// import * as ShapeLabelsFormatter from "@recogito/annotorious-shape-labels";

export const useAnnotorious = () => {
    const [annotorious, setAnnotorious] = useState(null);
    const [annotations, setAnnotations] = useState([]);

    const saveAnnotations = async (annotations) => {
        const token = localStorage.getItem("token");
        if (token) {
            var data = JSON.stringify(annotations);

            var config = {
                method: "post",
                url: "https://177.93.51.13/viewer/api/v1/set-annotation/ea3692f2-242c-4521-bdcc-74f19073ea9a/",
                headers: {
                    Authorization: `token ${token}`,
                },
                withCredentials: true,
                data: data,
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

    const setTools = (tools) => {
        if (!annotorious) return;

        let actualTools = annotorious.listDrawingTools();
        for (const tool of actualTools) {
            if (!tools.includes(tool)) {
                annotorious.removeDrawingTool(tool);
            }
        }

        SelectorPack(annotorious, {
            tools: tools, // "line", "multipolygon"
        });
        BetterPolygon(annotorious);
        annotorious.setDrawingTool(tools[0]);
        setAnnotorious(annotorious);
    };

    const initHandlers = (viewer, annotorious) => {
        const setLocalAnnotation = (newAnnotations) => {
            localStorage.setItem(viewer.id, JSON.stringify(newAnnotations));
        };

        const storedAnnotations = localStorage.getItem(viewer.id);

        // if (storedAnnotations !== null) {
        //     const savedAnnotations = JSON.parse(storedAnnotations);
        //     savedAnnotations.forEach((element) => {
        //         annotations.push(element);
        //     });
        //     annotorious.setAnnotations(savedAnnotations);
        // }

        const token = localStorage.getItem("token");
        if (token) {
            var currentdate = new Date();
            var datetime =
                currentdate.getDate() +
                "-" +
                (currentdate.getMonth() + 1) +
                "-" +
                currentdate.getFullYear();
            var config = {
                method: "get",
                url:
                    "https://177.93.51.13/viewer/api/v1/get-single-annotation/ea3692f2-242c-4521-bdcc-74f19073ea9a/" +
                    datetime,
                headers: {
                    Authorization: `token ${token}`,
                },
                withCredentials: true,
            };

            axios(config)
                .then(function (response) {
                    // console.log(response.data[0]);
                    const savedAnnotations = response.data;
                    savedAnnotations.forEach((element) => {
                        annotations.push(element);
                    });
                    annotorious.setAnnotations(savedAnnotations);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }

        annotorious.on("createAnnotation", (annotation) => {
            // console.log("created", annotation);
            // const newAnnotations = [...annotations, annotation];
            // setAnnotations(newAnnotations);
            // setLocalAnnotation(newAnnotations);
            setAnnotations(annotations.push(annotation));
            // setLocalAnnotation(annotations);
            saveAnnotations(annotations);
        });

        annotorious.on("updateAnnotation", (annotation, previous) => {
            console.log("updated", annotation, previous);
            let iter = 0;
            const updatedAnnotations = annotations.map((val) => {
                if (val.id === annotation.id) {
                    annotations[iter] = annotation;
                    return annotation;
                }
                iter = iter + 1;
                return val;
            });
            setAnnotations(updatedAnnotations);
            // setLocalAnnotation(updatedAnnotations);
        });

        annotorious.on("deleteAnnotation", (annotation) => {
            console.log("deleted", annotation);
            const savedAnnotations = JSON.parse(localStorage.getItem(viewer.id));
            const deletedAnnotations = savedAnnotations.filter((val) => {
                if (val.id !== annotation.id) {
                    return val;
                }
                return null;
            });
            console.log(deletedAnnotations);
            setAnnotations(deletedAnnotations);
            // setLocalAnnotation(deletedAnnotations);
        });
    };

    var getMeasures = function (annotation) {
        // console.log(annotation.target.selector.type);
        // console.log(annotation.target.selector.value);

        let toolType = annotation.target.selector.type;
        let toolValue = annotation.target.selector.value;
        let coords = null;
        let perimeter = null;
        let area = null;
        let measures = {};

        switch (toolType) {
            case "FragmentSelector":
                coords = toolValue.split(":")[1].split(",");
                console.log(coords);
                perimeter = 2.0 * parseFloat(coords[2]) + 2.0 * parseFloat(coords[3]);
                area = parseFloat(coords[2]) * parseFloat(coords[3]);
                measures = {
                    perimeter: perimeter.toFixed(4).toString(),
                    area: area.toFixed(4).toString(),
                };
                return console.log(measures);
            case "SvgSelector":
                if (toolValue.includes("circle")) {
                    coords = [
                        toolValue.substring(
                            toolValue.indexOf("cx=") + 4,
                            toolValue.indexOf("cy=") - 2
                        ),
                        toolValue.substring(
                            toolValue.indexOf("cy=") + 4,
                            toolValue.indexOf("r=") - 2
                        ),
                        toolValue.substring(
                            toolValue.indexOf("r=") + 3,
                            toolValue.indexOf('">')
                        ),
                    ];
                    console.log(coords);
                    perimeter = 2.0 * Math.PI * parseFloat(coords[2]);
                    area = Math.PI * Math.pow(parseFloat(coords[2]), 2);
                    measures = {
                        perimeter: perimeter.toFixed(4).toString(),
                        area: area.toFixed(4).toString(),
                    };
                } else if (toolValue.includes("ellipse")) {
                    coords = [
                        toolValue.substring(
                            toolValue.indexOf("cx=") + 4,
                            toolValue.indexOf("cy=") - 2
                        ),
                        toolValue.substring(
                            toolValue.indexOf("cy=") + 4,
                            toolValue.indexOf("rx=") - 2
                        ),
                        toolValue.substring(
                            toolValue.indexOf("rx=") + 4,
                            toolValue.indexOf("ry=") - 2
                        ),
                        toolValue.substring(
                            toolValue.indexOf("ry=") + 4,
                            toolValue.indexOf('">')
                        ),
                    ];
                    console.log(coords);
                    perimeter =
                        2.0 *
                        Math.PI *
                        Math.sqrt(
                            (Math.pow(parseFloat(coords[2]), 2) +
                                Math.pow(parseFloat(coords[3]), 2)) /
                                2.0
                        );
                    area = Math.PI * parseFloat(coords[2]) * parseFloat(coords[3]);
                    measures = {
                        perimeter: perimeter.toFixed(4).toString(),
                        area: area.toFixed(4).toString(),
                    };
                } else if (toolValue.includes("polygon")) {
                    coords = [
                        toolValue.substring(
                            toolValue.indexOf("points=") + 8,
                            toolValue.indexOf("/>") - 2
                        ),
                    ];
                    coords = coords[0].split(" ");
                    console.log(coords);
                    measures = {
                        perimeter: null,
                        area: null,
                    };
                } else if (toolValue.includes("path")) {
                    coords = [];
                    console.log(coords);
                    measures = {
                        perimeter: null,
                        area: null,
                    };
                }
                return console.log(measures);
            default:
                console.log(
                    toolType + "no coincide con ningún tipo de anotación la lista."
                );
        }
    };

    var rulerValue = function (annotation) {
        let toolValue = annotation.target.selector.value;
        let coords = null;
        let distance = {};

        if (toolValue.includes("line")) {
            coords = [
                toolValue.substring(
                    toolValue.indexOf("x1=") + 4,
                    toolValue.indexOf("y1=") - 2
                ),
                toolValue.substring(
                    toolValue.indexOf("y1=") + 4,
                    toolValue.indexOf("x2=") - 2
                ),
                toolValue.substring(
                    toolValue.indexOf("x2=") + 4,
                    toolValue.indexOf("y2=") - 2
                ),
                toolValue.substring(
                    toolValue.indexOf("y2=") + 4,
                    toolValue.indexOf('">')
                ),
            ];
            console.log(coords);

            let pixels = Math.sqrt(
                Math.pow(coords[2] - coords[0], 2) + Math.pow(coords[3] - coords[1], 2)
            );

            let microns = pixels * 0.25;

            distance = {
                pixels: pixels.toFixed(4).toString() + " px",
                microns: microns.toFixed(4).toString() + " µm",
            };

            console.log(distance);

            let angle =
                (Math.atan2(coords[3] - coords[1], coords[2] - coords[0]) * 180) /
                Math.PI;

            console.log(angle);

            const foreignObject = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "foreignObject"
            );
            foreignObject.innerHTML = `
                <label xmlns="http://www.w3.org/1999/xhtml" >
                    ${distance.microns}
                </label>
            `;

            foreignObject.style.transform = "rotate(" + angle + "deg)";

            return {
                element: foreignObject,
            };
        }
    };

    const createAnnotorious = (viewer, session) => {
        const config = {
            allowEmpty: true,
            disableEditor: false,
            drawOnSingleClick: true,
            formatter: getMeasures,
            readOnly: false,
            hotkey: "Shift",
            locale: "auto",
            crosshair: false,
            widgets: [
                "COMMENT",
                { widget: "TAG", vocabulary: ["Tumor", "Necrosis", "Sano"] },
            ],
        };

        const annotorious = Annotorious(viewer, config);

        // annotorious.formatters = [getMeasures, rulerValue];

        annotorious.setAuthInfo({
            id: "000000",
            displayName: session.name,
        });

        initHandlers(viewer, annotorious);

        // let tools = ["circle", "polygon", "rect", "point", "ellipse", "freehand", "line"];
        let tools = ["circle", "polygon", "rect", "point", "ellipse", "freehand"];

        let actualTools = annotorious.listDrawingTools();
        for (const tool of actualTools) {
            if (!tools.includes(tool)) {
                annotorious.removeDrawingTool(tool);
            }
        }

        SelectorPack(annotorious, {
            tools: tools,
        });
        BetterPolygon(annotorious);
        annotorious.setDrawingTool(tools[0]);

        setAnnotorious(annotorious);
    };

    return { annotorious, annotations, setTools, initHandlers, createAnnotorious };
};

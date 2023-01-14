import { useState, useEffect } from "react";

/* ====== Components ====== */
import ToolbarOptions from "../navbar/annotations/utils/toolbarOptions";

/* ====== Contexts ====== */
import { useViewerContext } from "../../contexts/ViewerContext";
import { useToggleContext } from "../../contexts/ToggleContext";

import * as Toolbar from "@recogito/annotorious-toolbar";
// import Toolbar from "../utils/Toolbar/index";

import OpenSeadragon from "openseadragon";

import { TwitterPicker } from "react-color";

const AnnotationsTools = () => {
    const { viewer, annotorious, annotations, setTools } = useViewerContext();

    const { showAnnotTable, setShowAnnotTable } = useToggleContext();

    const [colorState, setColorState] = useState({
        displayColorPicker: false,
        color: {
            r: "0",
            g: "171",
            b: "0",
            a: "1",
        },
    });

    useEffect(() => {
        // setTools(["circle", "polygon", "rect", "point", "ellipse", "freehand", "line"]);
        setTools(["circle", "polygon", "rect", "point", "ellipse", "freehand"]);
        Toolbar(annotorious, window.document.getElementById("annotation-tools"));

        window.document.getElementById("color-color").style.backgroundColor =
            "rgba(" +
            colorState.color.r +
            "," +
            colorState.color.g +
            "," +
            colorState.color.b +
            "," +
            colorState.color.a +
            ")";
    }, [annotorious]);

    function exportJSON() {
        var a = window.document.createElement("a");
        a.setAttribute(
            "href",
            "data:text/json;charset=utf-8," +
                encodeURIComponent(JSON.stringify(annotations))
        );
        a.setAttribute("download", "prueba.json");
        a.click();
    }

    function exportXML() {}

    function setupAnnotations() {
        rulerStart.length = 0;
        rulerEnd.length = 0;
        prepCanvasForAnnotations();
        viewer.addHandler("update-viewport", redrawAnnotations);
    }
    // var viewer = window.viewer; //read from global
    // var info = window.slideinfo; //read from global

    function getMpp() {
        // return info.mpp;
        return 0.25;
    }

    var paint; //Flag for whether an annotation is in progress
    var annotationType = "ruler"; //Indicates which type of annotation (e.g. arrow, rectangle) is due to be drawn next or in progress
    var imgWidth; //Width of the viewer
    var imgHeight; //Height of the viewer
    var imgAspectRatio; //Aspect ratio of the viewer
    var contextZoom; //Current zoom level (for use when actually drawing)
    var annotationsDefined = false;

    // var inactiveButtonColor = "#DCDCDC";
    // var activeButtonColor = "#FF4500";

    //var rulerWidth = 25;
    var rulerWidth = 3;

    //Ruler annotations
    var rulerStart = [];
    var rulerEnd = [];

    function prepCanvasForAnnotations() {
        //Initialization for each slide
        imgWidth = viewer.source.dimensions.x;
        imgHeight = viewer.source.dimensions.y;
        imgAspectRatio = imgWidth / imgHeight;

        // var overlayCanvas = viewer.drawer.canvas;
        // overlayCanvas.addEventListener("mousedown", doMouseDown, false);
        // overlayCanvas.addEventListener("mousemove", doMouseMove, false);
        // overlayCanvas.addEventListener("mouseup", doMouseUp, false);

        var tracker = new OpenSeadragon.MouseTracker({
            element: viewer.container,
            pressHandler: doMouseDown,
            dragHandler: doMouseMove,
            releaseHandler: doMouseUp,
        });
        tracker.setTracking(true);
    }

    function addAnnotation(type) {
        if (viewer.isMouseNavEnabled()) {
            viewer.setMouseNavEnabled(false);
            annotationType = type;
            // window.document.getElementById(
            //     "#" + type + "Annotation"
            // ).style.backgroundColor = activeButtonColor;
        } else {
            //Clicking on another annotation button before drawing an annotation
            if (type === annotationType) {
                //Same button; turn annotation mode off
                annotationModeOff();
            } else {
                //switch annotation types
                // window.document.getElementById(
                //     "#" + annotationType + "Annotation"
                // ).style.backgroundColor = inactiveButtonColor;
                annotationType = type;
                // window.document.getElementById(
                //     "#" + type + "Annotation"
                // ).style.backgroundColor = activeButtonColor;
            }
        }
    }

    function annotationModeOff() {
        paint = false;
        viewer.setMouseNavEnabled(true);
        // window.document.getElementById(
        //     "#" + annotationType + "Annotation"
        // ).style.backgroundColor = inactiveButtonColor;
        annotationType = "";
    }

    function offsetX(x) {
        //x is in pixels from the edge of the window
        //account for the offset of the viewport (e.g. edge of the visible image) from the edge of the window
        var viewerWindow = window.document.getElementById("viewer");
        var mouseX = x - viewerWindow.offsetLeft;
        // console.log(mouseX);
        //Get the percentage ofdistance across the screen represented by x
        var screenPortion = mouseX / viewer.container.clientWidth;
        //Viewport width is the percentage of the total image visible in the viewport
        //screenPortion is the mouse x position as a percentage across the viewport
        //Get the number of pixels (in image space) from the edge of the visible portion of the image to the position represented by x
        var imagePortion =
            screenPortion * viewer.viewport.getBounds(true).width * imgWidth;
        //Get the number of pixels (in image space) from the beginning of the image to the edge of the visible portion of the image
        //     plus the number of pixels from the edge of the visible portion to the mouse x position
        return viewer.viewport.getBounds(true).x * imgWidth + imagePortion;
    }

    function offsetY(y) {
        var viewerWindow = window.document.getElementById("viewer");
        var mouseY = y - viewerWindow.offsetTop;
        var screenPortion = mouseY / viewer.container.clientHeight;
        var imagePortion =
            screenPortion *
            viewer.viewport.getBounds(true).height *
            imgHeight *
            imgAspectRatio;
        return (
            viewer.viewport.getBounds(true).y * imgHeight * imgAspectRatio + imagePortion
        );
    }

    function doMouseDown(event) {
        // if (event.which == 1) {
        annotationType = "ruler"; // Hay un bug al seleccionar un color y luego medir
        if (annotationType !== "" && !viewer.isMouseNavEnabled()) {
            paint = true;
            if (annotationType === "ruler") {
                // var newRuler = new OpenSeadragon.Point(
                //     offsetX(event.position["x"]),
                //     offsetY(event.position["y"])
                // );
                var viewportPoint = viewer.viewport.pointFromPixel(event.position);
                var imagePoint =
                    viewer.viewport.viewportToImageCoordinates(viewportPoint);
                var newRuler = new OpenSeadragon.Point(imagePoint["x"], imagePoint["y"]);
                // console.log(newRuler);
                rulerStart.push(newRuler);
                rulerEnd.push(newRuler);
                annotationsDefined = true;
            }
            redrawAnnotations();
        }
        // }
    }

    function doMouseMove(event) {
        // if (event.which == 1) {
        if (annotationType !== "" && !viewer.isMouseNavEnabled()) {
            if (paint) {
                if (annotationType === "ruler") {
                    // rulerEnd[rulerEnd.length - 1] = new OpenSeadragon.Point(
                    //     offsetX(event.position["x"]),
                    //     offsetY(event.position["y"])
                    // );
                    var viewportPoint = viewer.viewport.pointFromPixel(event.position);
                    var imagePoint =
                        viewer.viewport.viewportToImageCoordinates(viewportPoint);
                    rulerEnd[rulerEnd.length - 1] = new OpenSeadragon.Point(
                        imagePoint["x"],
                        imagePoint["y"]
                    );
                }
                redrawAnnotations();
            }
        }
        // }
    }

    function doMouseUp(event) {
        // if (event.which == 1) {
        if (annotationType !== "" && !viewer.isMouseNavEnabled()) {
            if (paint) {
                annotationModeOff();
                redrawAnnotations();
            }
        } else {
            annotationModeOff();
        }
        // }
    }

    function redrawAnnotations() {
        if (annotationsDefined) {
            var viewportOrigin = new OpenSeadragon.Point(0, 0);
            var boundsRect = viewer.viewport.getBounds(true);
            viewportOrigin.x = boundsRect.x;
            viewportOrigin.y = boundsRect.y * imgAspectRatio;

            var viewportWidth = boundsRect.width;
            var viewportHeight = boundsRect.height * imgAspectRatio;
            var viewportZoom = viewer.viewport.getZoom(true);
            var image1 = viewer.world.getItemAt(0);
            var zoom = image1.viewportToImageZoom(viewportZoom);
            var offsetX =
                ((viewportOrigin.x / imgWidth - viewportOrigin.x) / viewportWidth) *
                viewer.container.clientWidth;
            var offsetY =
                ((viewportOrigin.y / imgHeight - viewportOrigin.y) / viewportHeight) *
                viewer.container.clientHeight;

            //Translate, zoom, and setTransform functions don"t appear to be working properly in IE11.
            viewer.drawer.context.translate(offsetX, offsetY);
            viewer.drawer.context.scale(zoom, zoom);
            drawAllIndividualAnnotations(offsetX, offsetY, zoom);
            viewer.drawer.context.setTransform(1, 0, 0, 1, 0, 0);
            viewer.forceRedraw();
        }
    }

    function drawAllIndividualAnnotations(offsetX, offsetY, zoom) {
        contextZoom = zoom; //used by transform()
        //Get the drawing context
        var context = viewer.drawer.context;

        //Set the drawing style, thickness, color
        // context.lineJoin = "round";
        // context.lineWidth = 5 / zoom;
        // context.strokeStyle = "#ffee00ce";
        //Begin a path which will include all arrows, rectangles, freehand shapes, and text labels (not circles or rulers)
        // context.beginPath();
        // context.stroke();
        //Any number of arrows, rectangles, and freehand drawings can share a single preceding beginPath() and following stroke()
        //But each circle needs its own beginPath() and stroke()
        for (var i = 0; i < rulerStart.length; i++) {
            var dx = rulerEnd[i].x - rulerStart[i].x;
            var dy = rulerEnd[i].y - rulerStart[i].y;
            var d = Math.sqrt(dx * dx + dy * dy);
            if (dy < 0) {
                d = d * -1;
            }
            context.save();
            if (dx / d > 0) {
                context.translate(rulerStart[i].x, rulerStart[i].y);
                context.rotate(Math.acos(dx / d));
            } else {
                context.translate(rulerEnd[i].x, rulerEnd[i].y);
                context.rotate(Math.acos(dx / d) + Math.PI);
            }
            //Draw bar
            context.fillStyle = "#ffee00ce";
            var rulerHeight = rulerWidth / zoom;
            context.fillRect(0, 0, d, rulerHeight);
            //Draw tick marks every 100 microns
            //Translate the total distance from pixels (in whole slide coordinates) to microns
            var microns = pixels2microns(dx, dy);
            //Get the start position of the line
            var startPosition = Math.min(d, 0);
            //Change drawing color to black
            context.fillStyle = "#000000";
            //Get the number of pixels in 100 microns
            // cada 25micras, cada 100 micras, cada 250 micras, cada 500 micras
            var tickThickness = 2 / zoom;
            var tickDistance = Math.abs((d / microns) * 100);

            var ticksBetweenMm = 10; // Cada 100 micras
            if (tickDistance < tickThickness * 5) {
                console.log("Cada milimetro");
                //Switch from ticks every half mm to ticks every mm
                tickDistance = tickDistance * 2;
                ticksBetweenMm = 1;
            }
            if (tickDistance < tickThickness * 5) {
                console.log("Cada 500 micras");
                //Switch from ticks every 100 microns to ticks every 500 microns, i.e. 0.5 mm
                tickDistance = tickDistance * 5;
                ticksBetweenMm = 2;
            }
            // if (microns > 100 && microns < 500) {
            //     ticksBetweenMm = 2;
            // }
            // if (microns > 500 && microns < 1000) {
            //     ticksBetweenMm = 5;
            // }
            // if (microns > 1000) {
            //     ticksBetweenMm = 10;
            // }
            //Draw tick marks
            var tickCount = 0;
            for (var inc = tickDistance; inc < Math.abs(d); inc += tickDistance) {
                tickCount++;
                if (tickCount === ticksBetweenMm) {
                    context.fillRect(
                        startPosition + inc,
                        -tickThickness,
                        tickThickness,
                        rulerHeight + 2 * tickThickness
                    );
                    tickCount = 0;
                } else {
                    context.fillRect(startPosition + inc, 0, tickThickness, rulerHeight);
                }
            }
            //Draw background for labels
            var lblFont = 13 / zoom;
            context.fillStyle = "#ffffffce";

            if (microns > 100) {
                context.fillRect(
                    startPosition,
                    rulerHeight * 1.2,
                    90 / zoom,
                    lblFont * 1.5
                );
            } else if (microns < 100) {
                context.fillRect(
                    startPosition,
                    rulerHeight * 1.2,
                    80 / zoom,
                    lblFont * 1.5
                );
            }

            context.font = lblFont + "px LouisGeorgeCafe";
            context.fillStyle = "#000000";

            var distance = microns.toFixed(4).toString() + " µm";
            var rulerLabelHeight = rulerHeight + 1.1 * lblFont;

            context.textAlign = "left";
            context.fillText(distance, startPosition + 5 / zoom, rulerLabelHeight);

            context.restore();
        }
    }

    function pixels2microns(pixelsX, pixelsY) {
        var mppConversion = getMpp();

        let micronsX = pixelsX * mppConversion;
        let micronsY = pixelsY * mppConversion;
        return Math.sqrt(micronsX * micronsX + micronsY * micronsY);
    }

    function getMeasure() {
        setupAnnotations();
        addAnnotation("ruler");
    }

    const colorClick = () => {
        setColorState({
            displayColorPicker: !colorState.displayColorPicker,
            color: {
                r: colorState.color.r,
                g: colorState.color.g,
                b: colorState.color.b,
                a: colorState.color.a,
            },
        });
    };

    const colorClose = () => {
        setColorState({
            displayColorPicker: false,
            color: {
                r: colorState.color.r,
                g: colorState.color.g,
                b: colorState.color.b,
                a: colorState.color.a,
            },
        });
    };

    const colorChange = (color) => {
        setColorState({
            displayColorPicker: colorState.displayColorPicker,
            color: color.rgb,
        });
        window.document.getElementById("color-color").style.backgroundColor =
            "rgba(" +
            color.rgb.r +
            "," +
            color.rgb.g +
            "," +
            color.rgb.b +
            "," +
            color.rgb.a +
            ")";
    };

    return (
        <div id="annotations-toolbar" className="annotations-toolbar">
            <ul className="nav-ul">
                <div className="color-swatch" onClick={colorClick}>
                    <div id="color-color" className="color-color" />
                </div>
                {colorState.displayColorPicker ? (
                    <div className="color-popover">
                        <div className="color-cover" onClick={colorClose} />
                        <TwitterPicker
                            width="205px"
                            color={colorState.color}
                            onChange={colorChange}
                            triangle="hide"
                        />
                    </div>
                ) : null}
                <hr />
                <ToolbarOptions
                    name="Tabla de anotaciones"
                    iconClass="far fa-edit"
                    shown={showAnnotTable}
                    onClick={setShowAnnotTable}
                />
                <hr />
                <div id="annotation-tools"></div>
                <hr />
                <ToolbarOptions
                    name="Regla"
                    iconClass="far fa-window-minimize"
                    onClick={getMeasure}
                />
                <hr />
                <ToolbarOptions
                    name="Exportar como JSON"
                    iconClass="far fa-save"
                    onClick={exportJSON}
                />
                <ToolbarOptions
                    name="Exportar como XML"
                    iconClass="far fa-share-square"
                    onClick={exportXML}
                />
            </ul>
        </div>
    );
};

export default AnnotationsTools;

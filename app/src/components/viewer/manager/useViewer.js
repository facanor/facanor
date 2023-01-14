import { useEffect, useState } from "react";
import OpenSeadragon from "openseadragon";
import axios from "axios";

import { Scalebar } from "../utils/scalebar";
import { RGB } from "../utils/rgb";

/* ====== Contexts ====== */
import { useSessionContext } from "../../../contexts/SessionContext";

/* ====== Hooks ====== */
import { useAnnotorious } from "../../annotations/manager/useAnnotorious";

export const useViewer = () => {
    const [viewer, setViewer] = useState(null);
    const [zoom, setZoom] = useState(0.0);
    const [cursor, setCursor] = useState({ x: 0, y: 0 });
    const [rgb, setRgb] = useState({ r: 0, g: 0, b: 0 });
    const [mpp, setMpp] = useState(0.5);
    const [magnification, setMagnification] = useState(20);
    const [slideInfo, setSlideInfo] = useState({ slidePath: "" });

    const { annotorious, annotations, setTools, initHandlers, createAnnotorious } =
        useAnnotorious();

    const { session, inSession } = useSessionContext();

    // useEffect(() => {
    //     if (viewer === null) return;
    //     createAnnotorious(viewer, session);
    // }, [session]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            var config = {
                method: "get",
                url: "https://177.93.51.13/viewer/api/v1/get-slide/ea3692f2-242c-4521-bdcc-74f19073ea9a/",
                headers: {
                    Authorization: `token ${token}`,
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            };

            axios(config)
                .then(async function (response) {
                    await setSlideInfo({
                        slidePath:
                            "https://177.93.51.13/media/" +
                            response.data.tilesPath +
                            "/slide.dzi",
                    });
                    await setMpp(response.data.properties["openslide.mpp-x"]);
                    await setMagnification(
                        response.data.properties["openslide.objective-power"]
                    );
                    // logoutTemplate = <>La sesión se ha cerrado correctamente.</>;
                    // successAlert(logoutTemplate, "light", 4000, 0);
                })
                .catch(function (error) {
                    console.log(error);
                });
        } else if (session.name !== "") {
            setSlideInfo({
                slidePath:
                    "http://168.176.61.15:12005/media/rdpt/tiles/hun/2022/pro/12/slide.dzi",
            });
        } else {
            setSlideInfo({ slidePath: "" });
            setMpp(0.5);
            setMagnification(20);
        }
    }, [inSession]);

    const createViewer = (id) => {
        // Mensajes de error nativos de OpenSeadragon
        OpenSeadragon.setString(
            "Errors.OpenFailed",
            "Ha ocurrido un error al abrir esta imagen. Si el problema persiste, comunícate con el equipo de soporte."
        );

        const object = OpenSeadragon({
            id,
            tileSources: slideInfo.slidePath,
            tabIndex: 0, // Índice del objeto OSD
            debugMode: false,
            blendTime: 0.1, // Animación entre transiciones de parches
            autoHideControls: false,
            imageSmoothingEnabled: true, // Suavizado de los pixeles en los parches renderizados
            minZoomLevel: 0.8,
            defaultZoomLevel: 0.8,
            homeFillsViewer: false, // Ajusta la vista al tamaño de la imagen
            panHorizontal: true, // Permite movimiento horizontal
            panVertical: true, // Permite movimiento vertical
            maxZoomPixelRatio: 1, // Factor de aumento
            iOSDevice: false, // Es un dispositivo Apple?
            showFullPageControl: true,
            showHomeControl: true,
            showZoomControl: true,
            visibilityRatio: 1, // Porcentaje de la imagen mostrada en el visor
            imageLoaderLimit: 0, // Cantidad de peticiones concurrentes, 0: Máximo número de peticiones en paralelo
            animationTime: 1, // Duración de la animación
            zoomPerClick: 1.6,
            zoomPerScroll: 1.2,
            showNavigator: true, // Muestra/Oculta el minimapa de navegación
            navigatorPosition: "ABSOLUTE", // Posición del minimapa de navegación, ABSOLUTE: Posición personalizada
            navigatorTop: "0.625rem",
            navigatorLeft: "calc(100% - 20vw - 0.625rem)",
            navigatorHeight: "22vh",
            navigatorWidth: "20vw",
            navigatorAutoFade: false,
            navigatorRotate: true, // El minimapa rota al rotar el visor
            showNavigationControl: true,
            navigationControlAnchor: OpenSeadragon.ControlAnchor.TOP_RIGHT,
            maxImageCacheCount: 200, // Cantidad de imágenes cargadas en memoria (por visor)
            minPixelRatio: 0.8, // Calidad de la imagen: - es más calidad, + es menos calidad (más rapido)
            zoomInButton: "zoom-in",
            zoomOutButton: "zoom-out",
            homeButton: "reset-size",
            fullPageButton: "full-screen",
            crossOriginPolicy: "Anonymous", // Los valores posibles son: Anonymous, use-credentials y false
            constrainDuringPan: true,
            // toolbar: "toolbar-nav", // Contenedor de los botones de acción de OSD
        });

        setViewer(object);
        createAnnotorious(object, session);
        setZoom(object.viewport.getZoom(true).toFixed(2));
        setCursor({ x: 0, y: 0 });
        setRgb({ r: 0, g: 0, b: 0 });

        // Footer Handlers

        var updateZoom = function () {
            var zoom = object.viewport.getZoom(true);
            var imgZoom = object.viewport.viewportToImageZoom(zoom);
            setZoom((imgZoom * magnification).toFixed(2));
        };

        object.addHandler("open", function () {
            var tracker = new OpenSeadragon.MouseTracker({
                element: object.container,
                moveHandler: function (event) {
                    var webPoint = event.position;
                    var viewportPoint = object.viewport.pointFromPixel(webPoint);
                    var imagePoint =
                        object.viewport.viewportToImageCoordinates(viewportPoint);

                    setCursor({
                        x: Math.round(imagePoint["x"]),
                        y: Math.round(imagePoint["y"]),
                    });

                    var zoom = object.viewport.getZoom(true);
                    var imgZoom = object.viewport.viewportToImageZoom(zoom);

                    setZoom((imgZoom * magnification).toFixed(2));
                },
            });
            tracker.setTracking(true);
            object.addHandler("animation", updateZoom);
        });

        // Scalebar

        OpenSeadragon.Viewer.prototype.scalebar = function (options) {
            if (!this.scalebarInstance) {
                options = options || {};
                options.viewer = this;
                this.scalebarInstance = new Scalebar(options);
            }
        };

        object.scalebar({
            type: 1,
            pixelsPerMeter: mpp ? 1e6 / mpp : 0,
            minWidth: "150px",
            location: 4,
            xOffset: 10,
            yOffset: 28,
            stayInsideImage: false,
            color: "var(--font-black-primary)",
            fontColor: "var(--font-black-primary)",
            backgroundColor: "var(--bg-white-secondary)",
            fontSize: "small",
            barThickness: 3,
            container: "div-scale",
        });

        // RGB values

        OpenSeadragon.Viewer.prototype.rgb = function (options) {
            if (!this.rgbInstance || options) {
                options = options || {};
                options.viewer = this;
                this.rgbInstance = new RGB(options);
            }
            return this.rgbInstance;
        };

        object.rgb({
            onCanvasHover: function (color) {
                setRgb({ r: color["r"], g: color["g"], b: color["b"] });
            },
        });
    };

    return {
        viewer,
        zoom,
        setZoom,
        cursor,
        rgb,
        magnification,
        createViewer,
        createAnnotorious,
        annotorious,
        annotations,
        setTools,
        initHandlers,
        slideInfo,
    };
};

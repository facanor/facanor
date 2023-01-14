import { useEffect } from "react";

/* ====== CSS ====== */
import "./footer.css";

/* ====== Components ====== */
import { promiseAlert } from "../../utils/alert";

/* ====== Contexts ====== */
import { useToggleContext } from "../../contexts/ToggleContext";
import { useViewerContext } from "../../contexts/ViewerContext";
import { useThemeContext } from "../../contexts/ThemeContext";

const Footer = () => {
    const { showAnnotTable, setShowAnnotTable, showNavTable, setShowNavTable } =
        useToggleContext();
    const { cursor, zoom, rgb } = useViewerContext();
    const { theme, setTheme } = useThemeContext();

    var imageCoords = document.querySelectorAll(
        "#footer .footer-coordinates .image-coordinates"
    )[0];
    var imageZoom = document.querySelectorAll("#footer .footer-zoom .image-zoom")[0];
    var imageRGB = document.querySelectorAll("#footer .footer-rgb .image-rgb")[0];

    useEffect(() => {
        if (imageCoords === undefined) return;

        imageCoords.innerHTML =
            "<span class='image-coordinates-label'>Coords</span>" +
            "<span class='image-coordinates-value'>" +
            cursor.x +
            ", " +
            cursor.y +
            "</span>" +
            "<span class='image-coordinates-measure'>pixeles</span>";

        imageRGB.innerHTML =
            "<span class='image-rgb-label'>RGB</span>" +
            "<span class='image-rgb-value'>" +
            rgb["r"] +
            ", " +
            rgb["g"] +
            ", " +
            rgb["b"] +
            "</span>" +
            "<span class='image-rgb-measure'></span>";
    }, [cursor]);

    useEffect(() => {
        if (imageZoom === undefined) return;

        imageZoom.innerHTML =
            "<span class='image-zoom-label'>Zoom</span>" +
            "<span class='image-zoom-value'>" +
            zoom +
            "</span>" +
            "<span class='image-zoom-measure'>x</span>";
    }, [zoom]);

    useEffect(() => {
        if (theme) {
            document.querySelector(":root").classList.add("dark");
            document.querySelector(":root").classList.remove("light");
        } else {
            document.querySelector(":root").classList.add("light");
            document.querySelector(":root").classList.remove("dark");
        }
    }, [theme]);

    return (
        <>
            <div className="footer-buttons">
                <ul className="nav-ul">
                    <li
                        className="nav-li"
                        onClick={() => setShowAnnotTable(!showAnnotTable)}
                    >
                        <button
                            type="button"
                            className="btn btn-default"
                            title="Anotaciones"
                        >
                            <i className="far fa-edit"></i>
                        </button>
                    </li>
                    <li className="nav-li" onClick={() => setShowNavTable(!showNavTable)}>
                        <button
                            type="button"
                            className="btn btn-default"
                            title="Navegaciones"
                        >
                            <i className="far fa-paper-plane"></i>
                        </button>
                    </li>
                </ul>
            </div>
            <div className="footer-information">
                <div className="footer-coordinates">
                    <div className="image-coordinates"></div>
                </div>
                <div className="footer-zoom">
                    <div className="image-zoom"></div>
                </div>
                <div className="footer-rgb">
                    <div className="image-rgb"></div>
                </div>
                <div className="footer-hsl">
                    <div className="image-hsl"></div>
                </div>
            </div>
            <div className="footer-alerts">
                <ul className="nav-ul">
                    <li className="nav-li" onClick={promiseAlert}>
                        <button type="button" className="btn btn-default" title="Alertas">
                            <i className="far fa-bell"></i>
                        </button>
                    </li>
                    <li className="nav-li button-toggle" onClick={() => setTheme(!theme)}>
                        <button
                            type="button"
                            className="theme-toggle"
                            data-theme={theme === true ? "dark" : "light"}
                            aria-label="auto"
                        >
                            <svg
                                className="sun-and-moon"
                                aria-hidden="true"
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                            >
                                <circle
                                    className="sun"
                                    cx="8"
                                    cy="8"
                                    r="4"
                                    mask="url(#moon-mask)"
                                    fill="currentColor"
                                />
                                <g className="sun-beams" stroke="currentColor">
                                    <line x1="8" y1="1" x2="8" y2="2.5" />
                                    <line x1="8" y1="13.5" x2="8" y2="15" />
                                    <line x1="3.04" y1="3.04" x2="4.3" y2="4.28" />
                                    <line x1="11.68" y1="11.48" x2="12.94" y2="12.94" />
                                    <line x1="1" y1="8" x2="2.5" y2="8" />
                                    <line x1="13.5" y1="8" x2="15" y2="8" />
                                    <line x1="3.04" y1="12.94" x2="4.3" y2="11.48" />
                                    <line x1="11.68" y1="4.48" x2="12.94" y2="2.84" />
                                </g>
                                <mask className="moon" id="moon-mask">
                                    <rect
                                        x="0"
                                        y="0"
                                        width="100%"
                                        height="100%"
                                        fill="white"
                                    />
                                    <circle cx="16" cy="7" r="3" fill="black" />
                                </mask>
                            </svg>
                        </button>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default Footer;

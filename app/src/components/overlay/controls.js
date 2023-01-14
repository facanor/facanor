import { useState, useEffect } from "react";

/* ====== Contexts ====== */
import { useViewerContext } from "../../contexts/ViewerContext";

// VER EL SIGUIENTE ENLACE
// https://stackoverflow.com/questions/57599173/react-input-range-with-default-step-as-an-array-of-values

const Controls = () => {
    const magnifications = ["FIT", 2, 4, 8, 10, 20, 40, 80, 100];
    const [minZoom, setMinZoom] = useState(null);
    const [state, setState] = useState(false);

    const { viewer, zoom, setZoom, magnification } = useViewerContext();

    useEffect(() => {
        if (!viewer) return;

        var viewerMinZoom = viewer.viewport.getMinZoom();
        setMinZoom(viewerMinZoom.toFixed(2));

        setState(true);
    }, [viewer]);

    function handleChange(event) {
        var value = event.target.value;
        setZoom(parseFloat(value).toFixed(2));

        var imgZoom = viewer.viewport.imageToViewportZoom(
            parseFloat(value).toFixed(2) / magnification
        );
        viewer.viewport.zoomTo(imgZoom, null, false);
    }

    function handleButton(buttonValue) {
        var imageZoom = 0;
        if (buttonValue === "FIT") {
            imageZoom = viewer.viewport.getMinZoom();
        } else {
            var value = buttonValue / viewer.viewport.getMaxZoom();
            imageZoom = viewer.viewport.imageToViewportZoom(value);
        }
        setZoom(imageZoom.toFixed(2));

        var buttonZoom = viewer.viewport.imageToViewportZoom(
            imageZoom.toFixed(2) / magnification
        );
        viewer.viewport.zoomTo(buttonZoom, null, false);
    }

    return (
        <>
            <div className="div-controls">
                <div className="div-range">
                    {state ? (
                        <input
                            type="range"
                            min={minZoom}
                            max={magnification}
                            step="0.2"
                            orient="vertical"
                            value={zoom}
                            onChange={handleChange}
                        />
                    ) : null}
                </div>
                <div className="div-levels">
                    <ul className="controls-ul">
                        {magnifications.map((val) => {
                            if (val <= magnification || val === "FIT")
                                return (
                                    <li
                                        key={val}
                                        className="controls-li"
                                        onClick={() => handleButton(val)}
                                    >
                                        <button type="button" className="btn btn-default">
                                            <p className="controls-p">
                                                {val}
                                                {val !== "FIT" ? <span>x</span> : null}
                                            </p>
                                        </button>
                                    </li>
                                );
                            return null;
                        })}
                    </ul>
                </div>
            </div>
            <div className="div-magnification">
                <p>
                    {zoom}
                    <span>x</span>
                </p>
            </div>
        </>
    );
};

export default Controls;

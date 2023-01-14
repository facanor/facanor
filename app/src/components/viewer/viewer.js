/* ====== CSS ====== */
import "./viewer.css";

/* ====== Components ====== */
import OpenSeaDragon from "./utils/openseadragon";

const Viewer = () => {
    return (
        <>
            <OpenSeaDragon slideID="viewer-canvas" className="viewer-osd" />
        </>
    );
};

export default Viewer;

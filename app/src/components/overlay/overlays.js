import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

/* ====== CSS ====== */
import "../../utils/alert.css";

/* ====== Components ====== */
import AnnotationsTools from "../annotations/toolbar";
import AnnotationsTable from "../annotations/table";
import NavigationsTools from "../navigations/toolbar";
import NavigationsTable from "../navigations/table";
import Report from "../report/report";
import Scale from "./scale";
import Controls from "./controls";
import Login from "../login/login";
import Viewer from "../viewer/viewer";

/* ====== Contexts ====== */
import { useToggleContext } from "../../contexts/ToggleContext";
import { useSessionContext } from "../../contexts/SessionContext";
import { useViewerContext } from "../../contexts/ViewerContext";

const Overlay = () => {
    const {
        showControls,
        showScale,
        showAnnotTools,
        showNavTools,
        showReport,
        showAnnotTable,
        showNavTable,
    } = useToggleContext();
    const { inSession } = useSessionContext();
    const { slideInfo } = useViewerContext();
    return (
        <>
            <ToastContainer newestOnTop autoClose={5000} limit={3} />
            {inSession && slideInfo.slidePath !== "" ? <Viewer /> : null}
            {showControls && inSession && slideInfo.slidePath !== "" ? (
                <Controls />
            ) : null}
            {showScale && inSession ? <Scale /> : null}
            {showAnnotTools ? <AnnotationsTools /> : null}
            {showAnnotTable ? <AnnotationsTable /> : null}
            {showNavTools ? <NavigationsTools /> : null}
            {showNavTable ? <NavigationsTable /> : null}
            {showReport ? <Report /> : null}
            {inSession ? null : <Login />}
        </>
    );
};

export default Overlay;

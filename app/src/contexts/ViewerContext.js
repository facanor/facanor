import { createContext, useContext } from "react";

/* ====== Hooks ====== */
import { useViewer } from "../components/viewer/manager/useViewer";

const ViewerContext = createContext();
export const useViewerContext = () => {
    return useContext(ViewerContext);
};

export const ViewerProvider = ({ children }) => {
    const {
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
    } = useViewer();

    return (
        <ViewerContext.Provider
            value={{
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
            }}
        >
            {children}
        </ViewerContext.Provider>
    );
};

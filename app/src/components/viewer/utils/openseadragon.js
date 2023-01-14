import React from "react";
import OpenSeadragon from "openseadragon";

/* ====== Support ====== */
import { sortWith, pathOr, ascend } from "ramda";

/* ====== Hooks ====== */
import useRequestTime from "../manager/useRequestTime";

/* ====== Contexts ====== */
import { useViewerContext } from "../../../contexts/ViewerContext";

const OpenSeaDragonContext = React.createContext({});

function reducer(
    state = {
        images: [],
        metadata: {},
        drawn: {},
    }
) {
    return state;
}

function OpenSeaDragon({ children, className, style, disableZoom, slideID }) {
    const [ready, setReady] = React.useState(true);
    const [state, dispatch] = React.useReducer(reducer, null, () => reducer(undefined));
    const { viewer, createViewer } = useViewerContext();

    React.useEffect(() => {
        if (!ready) return;
        createViewer(slideID);

        return async () => {
            setReady(false);
            if (OpenSeadragon.isFullScreen()) {
                await new Promise((resolve) => {
                    viewer.addOnceHandler("full-screen", resolve);
                    viewer.setFullScreen(false);
                });
            }
            setReady(true);
        };
    }, []); // ready

    useRequestTime(() => {
        if (!viewer) return;

        let items = [];
        for (let i = 0; i < viewer.world.getItemCount(); i++) {
            items.push(viewer.world.getItemAt(i));
        }

        const fallback = (item) =>
            pathOr(false, ["metadata", item.href, "fallback"], state) ? 1 : 0;

        const index = (item) => {
            const thing = pathOr(-1, ["metadata", item.href, "index"], state);
            return thing;
        };

        const sorted = sortWith([ascend(fallback), ascend(index)], items);
        for (let i = 0; i < sorted.length; i++) {
            const item = sorted[i];
            const currentIndex = viewer.world.getIndexOfItem(item);
            if (currentIndex !== i) {
                viewer.world.setItemIndex(item, i);
            }
        }
    }, 500);

    React.useEffect(() => {
        if (!viewer) return;

        const timeout = setTimeout(() => {
            viewer.gestureSettingsMouse.clickToZoom = !disableZoom;
        }, 10);
        return () => clearTimeout(timeout);
    }, [viewer, disableZoom]);

    const contextValue = React.useMemo(
        () => ({ state, dispatch, viewer: viewer }),
        [state, dispatch, viewer]
    );

    return (
        <OpenSeaDragonContext.Provider value={contextValue}>
            <div id={slideID} style={style} className={className} />
            {viewer ? children : null}
        </OpenSeaDragonContext.Provider>
    );
}

export default OpenSeaDragon;

import { useCallback } from "react";

export const useNavigationZoom = (viewer) => {
    const zoom = useCallback(() => {
        /* Define funciones que funcionan con hooks, 
		actualiza las funciones pero no las ejecuta */
        const varzoom = viewer.viewport.getZoom(true);

        console.log(varzoom);
    }, [viewer]);

    return { zoom };
};

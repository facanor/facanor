import { useCallback, useState } from "react";
import OpenSeadragon from "openseadragon";
import axios from "axios";

export const useNavigation = (viewer, session) => {
    //const [count, setCount] = useState(false);
    const [navigationData, setnavigationData] = useState([]);
    const [navigationRecording, setNavigationRecording] = useState(false);
    const [navigationPlaying, setNavigationPlaying] = useState(false);
    const [navigationPause, setNavigationPause] = useState(false);

    const [navigationTotalTime, setNavigationTotalTime] = useState(0);
    const [navigationElapseTime, setNavigationElapseTime] = useState(0);

    let prevTime = null;
    let storeNavigation = null;

    const saveNavigations = async (navigationData) => {
        const token = localStorage.getItem("token");
        if (token) {
            var data = navigationData;

            var config = {
                method: "post",
                url: "https://177.93.51.13/viewer/api/v1/set-navigation/ea3692f2-242c-4521-bdcc-74f19073ea9a/",
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

    const loadNavigations = async () => {
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
                    "https://177.93.51.13/viewer/api/v1/get-single-navigation/ea3692f2-242c-4521-bdcc-74f19073ea9a/" +
                    datetime,
                headers: {
                    Authorization: `token ${token}`,
                },
                withCredentials: true,
            };

            await axios(config)
                .then(function (response) {
                    console.log(response);
                    storeNavigation = response.data;
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    };

    const viewportupdate = useCallback(() => {
        const viewerZoom = viewer.viewport.getZoom();
        const realZoom = viewer.viewport.viewportToImageZoom(viewerZoom);
        const magnificationZoom = (realZoom * 20).toFixed(2);

        const viewportPoint = viewer.viewport.getBoundsNoRotateWithMargins(viewerZoom);
        const imagePoint = viewer.viewport.viewportToImageRectangle(
            viewportPoint.x,
            viewportPoint.y,
            viewportPoint.width,
            viewportPoint.height
        );

        const x1 = parseInt(imagePoint.x);
        const y1 = parseInt(imagePoint.y);
        const x2 = parseInt(imagePoint.x) + parseInt(imagePoint.width);
        const y2 = parseInt(imagePoint.y) + parseInt(imagePoint.height);
        console.log(x1, y1, x2, y2);

        let nextTime = new Date();
        let interval = nextTime - prevTime;
        prevTime = nextTime;
        // console.log(interval);
        // console.log(interval / 1000);
        // console.log(interval / 1000 / 60);

        // Guardar cuando la duración (intervalo) sea mayor a un umbral (500ms por ejemplo)

        if (interval > 20) {
            setnavigationData(
                // navigationData.push({
                //     // Coordenadas reales de la imagen (px)
                //     px: {
                //         x1: x1,
                //         y1: y1,
                //         x2: x2,
                //         y2: y2,
                //     },
                //     // Factor de coordenadas del canvas (vp)
                //     vp: {
                //         x: viewportPoint.x,
                //         y: viewportPoint.y,
                //         w: viewportPoint.width,
                //         h: viewportPoint.height,
                //     },
                //     z: realZoom,
                //     mgz: magnificationZoom,
                //     hr: interval,
                // })
                navigationData.push({
                    type: "Navigation",
                    header: {
                        creator: {
                            id: "000000",
                            name: session.name,
                        },
                        created: "2022-09-17T02:23:50.776Z",
                        duration: "0",
                    },
                    body: [
                        // Factor de coordenadas del canvas (vp)
                        {
                            zoom: realZoom.toString(),
                            duration: interval.toString(),
                            coordinates: {
                                x: viewportPoint.x.toString(),
                                y: viewportPoint.y.toString(),
                                w: viewportPoint.width.toString(),
                                h: viewportPoint.height.toString(),
                            },
                        },
                    ],
                    target: [
                        // Coordenadas reales de la imagen (px)
                        {
                            zoom: magnificationZoom.toString(),
                            duration: interval.toString(),
                            coordinates: {
                                x: x1.toString(),
                                y: y1.toString(),
                                w: x2.toString(),
                                h: y2.toString(),
                            },
                        },
                    ],
                })
            );

            // console.log(navigationData);
        }
    }, []);

    const start = useCallback(() => {
        setNavigationRecording(true);
        setNavigationPause(false);
        viewer.addHandler("zoom", viewportupdate);
        viewer.addHandler("canvas-drag", viewportupdate);
        prevTime = new Date();
    }, [viewer, viewportupdate]);

    const setLocalAnnotation = (navigationData) => {
        localStorage.setItem("pprueba", JSON.stringify(navigationData));
    };

    const stop = useCallback(() => {
        setNavigationRecording(false);
        setNavigationPause(false);
        viewer.removeHandler("zoom", viewportupdate);
        viewer.removeHandler("canvas-drag", viewportupdate);
        // setLocalAnnotation(navigationData);
        saveNavigations(navigationData);
    }, [viewer, viewportupdate]);

    const pause = useCallback(() => {
        setNavigationRecording(false);
        setNavigationPause(true);
        viewer.removeHandler("zoom", viewportupdate);
        viewer.removeHandler("canvas-drag", viewportupdate);
    }, [viewer, viewportupdate]);

    const drawNavigation = useCallback(
        (data) => {
            console.log(data);

            return new Promise((resolve) => {
                setTimeout(() => {
                    viewer.viewport.fitBounds(
                        new OpenSeadragon.Rect(
                            Number(data.coordinates.x),
                            Number(data.coordinates.y),
                            Number(data.coordinates.w),
                            Number(data.coordinates.h)
                        )
                    );
                    resolve();
                }, Number(data.duration));
            });
        },
        [viewer]
    );

    const run = useCallback(async () => {
        await loadNavigations();
        setNavigationPlaying(true);
        setNavigationPause(false);
        // const storeNavigation = JSON.parse(localStorage.getItem("pprueba"));

        console.log(storeNavigation);

        setNavigationTotalTime(
            storeNavigation.reduce((total, nav) => {
                return total + Number(nav.body[0].duration);
            }, 0)
        );
        setNavigationElapseTime(0);

        for (let i = 0; i < storeNavigation.length; i++) {
            const dataNav = storeNavigation[i].body[0];
            setNavigationElapseTime((value) => value + dataNav.duration);
            await drawNavigation(dataNav);
        }
        setNavigationPlaying(false);
    }, [viewer, viewportupdate]);

    const save = useCallback(() => {
        const storeNavigation = localStorage.getItem("pprueba");
        var a = document.createElement("a");
        var file = new Blob([storeNavigation], { type: "text/plain" });
        a.href = URL.createObjectURL(file);
        a.download = "NavigationBy" + session.name + ".json";
        a.click();
    }, []);

    // useEffect(() => {
    //     if (viewer == null) {
    //         return;
    //     }
    //     if (count == true) {
    //         //const varzoom = viewer.addHandler("zoom");
    //         const variables = viewer.addHandler("update-viewport", viewportupdate);
    //         //viewer.viewport.getZoom(true);

    //         console.log(variables);
    //     } else {
    //         viewer.removeHandler("update-viewport", viewportupdate);
    //         // acá averiguar como se deja de escuchar
    //     }
    // }, [viewportupdate, viewer, count]);

    return {
        navigationElapseTime,
        navigationTotalTime,
        start,
        stop,
        pause,
        run,
        save,
        navigationRecording,
        navigationPlaying,
        navigationPause,
    };
};

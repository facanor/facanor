import { useEffect, useState } from "react";

/* ====== Components ====== */
import ShowReproductionNavigationBar from "../navbar/navigations/utils/showReproductionNavigationBar";
import ToolbarOptions from "../navbar/navigations/utils/toolbarOptions";

/* ====== Hooks ====== */
import { useNavigation } from "../navbar/navigations/manager/useNavigation.js";

/* ====== Contexts ====== */
import { useViewerContext } from "../../contexts/ViewerContext";
import { useToggleContext } from "../../contexts/ToggleContext";
import { useSessionContext } from "../../contexts/SessionContext";

import * as Toolbar from "@recogito/annotorious-toolbar";

const ShowToolbarNavigation = () => {
    const { viewer, annotorious, setTools } = useViewerContext();
    const { showNavTable, setShowNavTable } = useToggleContext();
    const { session } = useSessionContext();

    const [showRunBar, setshowRunBar] = useState(false);

    const {
        navigationElapseTime,
        navigationTotalTime,
        start,
        stop,
        pause,
        save,
        run,
        navigationRecording,
        navigationPlaying,
        navigationPause,
    } = useNavigation(viewer, session);

    useEffect(() => {
        setTools(["polygon", "rect", "point"]);
        Toolbar(annotorious, window.document.getElementById("nav-annotation-tools"));
    }, [annotorious]);

    var recordingTemplate = (message, type) => (
        <div className="recording-message">
            {type === "record" ? <i className="fas fa-circle record"></i> : null}
            {type === "play" ? <i className="fas fa-dot-circle play"></i> : null}
            {type === "pause" ? <i className="fas fa-circle pause"></i> : null}
            {type === "waiting" ? <i className="fas fa-circle waiting"></i> : null}
            <span>{message}</span>
        </div>
    );

    return (
        <>
            {/* {navigationRecording && <div className="recording-message"> GRABANDO </div>}
            {navigationPlaying && (
                <div className="recording-message"> Reproduciendo navegación </div>
            )} */}

            {navigationRecording
                ? recordingTemplate("Grabando navegación", "record")
                : null}
            {navigationPlaying
                ? recordingTemplate("Reproduciendo navegación", "play")
                : null}
            {navigationPause ? recordingTemplate("Navegación pausada", "pause") : null}
            {!navigationRecording && !navigationPlaying && !navigationPause
                ? recordingTemplate("Esperando una acción", "waiting")
                : null}
            {/* <div style= {{position:"absolute", top:"50px", left:0}}>
                {navigationElapseTime} -  {navigationTotalTime}
            </div> */}

            <div id="navigations-toolbar" className="navigations-toolbar">
                <ul className="nav-ul">
                    <ToolbarOptions
                        name="Tabla de navegaciones"
                        iconClass="far fa-paper-plane"
                        shown={showNavTable}
                        onClick={setShowNavTable}
                    />
                    <hr />
                    {navigationRecording ? (
                        <ToolbarOptions
                            name="Pausar navegación"
                            iconClass="far fa-pause-circle"
                            onClick={pause}
                        />
                    ) : (
                        <ToolbarOptions
                            name="Comenzar navegación"
                            iconClass="far fa-play-circle"
                            onClick={start}
                        />
                    )}
                    <ToolbarOptions
                        name="Parar navegación"
                        iconClass="far fa-stop-circle"
                        onClick={stop}
                    />
                    <hr />
                    {showRunBar && (
                        <ShowReproductionNavigationBar></ShowReproductionNavigationBar>
                    )}
                    <ToolbarOptions
                        name="Reproducir última navegación"
                        iconClass="fas fa-camera-retro"
                        //onClick={run}
                        onClick={() => setshowRunBar((value) => !value)}
                    ></ToolbarOptions>

                    <hr />
                    <div id="nav-annotation-tools"></div>
                    <hr />
                    <ToolbarOptions
                        name="Exportar navegaciones"
                        iconClass="far fa-save"
                        onClick={save}
                    />
                </ul>
            </div>
        </>
    );
};

export default ShowToolbarNavigation;

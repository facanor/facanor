import { createContext, useState, useContext } from "react";

const ToggleContext = createContext();
export const useToggleContext = () => {
    return useContext(ToggleContext);
};

export const ToggleProvider = ({ children }) => {
    const [showControls, setShowControls] = useState(true);
    const [showScale, setShowScale] = useState(true);
    const [showAnnotTools, setShowAnnotTools] = useState(false);
    const [showAnnotTable, setShowAnnotTable] = useState(false);
    const [showNavTools, setShowNavTools] = useState(false);
    const [showNavTable, setShowNavTable] = useState(false);
    const [showReport, setShowReport] = useState(false);

    return (
        <ToggleContext.Provider
            value={{
                showControls,
                setShowControls,
                showScale,
                setShowScale,
                showAnnotTools,
                setShowAnnotTools,
                showAnnotTable,
                setShowAnnotTable,
                showNavTools,
                setShowNavTools,
                showNavTable,
                setShowNavTable,
                showReport,
                setShowReport,
            }}
        >
            {children}
        </ToggleContext.Provider>
    );
};

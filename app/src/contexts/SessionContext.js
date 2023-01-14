import { createContext, useState, useContext } from "react";

const SessionContext = createContext();
export const useSessionContext = () => {
    return useContext(SessionContext);
};

export const SessionProvider = ({ children }) => {
    const [inSession, setInSession] = useState(false);
    const [session, setSession] = useState({
        name: "",
        rol: "",
        institution: "",
    });

    return (
        <SessionContext.Provider
            value={{
                inSession,
                setInSession,
                session,
                setSession,
            }}
        >
            {children}
        </SessionContext.Provider>
    );
};

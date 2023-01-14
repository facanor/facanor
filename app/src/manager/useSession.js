import { useSessionContext } from "../contexts/SessionContext";

export const useSession = () => {
    const [session, setSession] = useSessionContext();
    console.log(session);
};

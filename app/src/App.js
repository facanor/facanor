/* ====== Components ====== */
import Navbar from "./components/navbar/navbar";
import Overlay from "./components/overlay/overlays";
import Footer from "./components/footer/footer";

/* ====== Contexts ====== */
import { ThemeProvider } from "./contexts/ThemeContext";
import { SessionProvider } from "./contexts/SessionContext";
import { ToggleProvider } from "./contexts/ToggleContext";
import { ViewerProvider } from "./contexts/ViewerContext";

const App = () => {
    return (
        <ThemeProvider>
            <SessionProvider>
                <ToggleProvider>
                    <ViewerProvider>
                        <div id="navbar">
                            <Navbar />
                        </div>
                        <div id="viewer">
                            <Overlay />
                        </div>
                        <div id="footer">
                            <Footer />
                        </div>
                    </ViewerProvider>
                </ToggleProvider>
            </SessionProvider>
        </ThemeProvider>
    );
};

export default App;

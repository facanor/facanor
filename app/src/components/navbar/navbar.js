/* ====== CSS ====== */
import "./navbar.css";

/* ====== Components ====== */
import Patients from "./patients/patients";
import View from "./view/view";
import Annotations from "./annotations/annotations";
import Navigations from "./navigations/navigations";
import Automate from "./automate/automate";
import Report from "./report/report";
import Help from "./help/help";
import Session from "./session/session";

const Navbar = () => {
    return (
        <div id="navbar-tools" className="navbar-tools">
            <ul className="nav-ul">
                <li className="nav-li brand">
                    <img src="/assets/favicon.png" alt=""></img>
                </li>
                <Patients />
                <View />
                <Annotations />
                <Navigations />
                <Automate />
                <Report />
                <Help />
                <Session />
            </ul>
        </div>
    );
};

export default Navbar;

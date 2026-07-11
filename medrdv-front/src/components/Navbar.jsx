import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

function Navbar() {
    return (
        <nav
            className="navbar navbar-expand-lg navbar-dark shadow-sm"
            style={{ backgroundColor: "#0D47A1" }}
        >
            <div className="container">

                <Link
                    className="navbar-brand d-flex align-items-center"
                    to="/"
                >
                    <img
                        src={logo}
                        alt="MedRDV"
                        width="45"
                        height="45"
                        className="me-2"
                    />

                    <div>
                        <strong>MedRDV</strong>
                        <div
                            style={{
                                fontSize: "12px",
                                lineHeight: "12px",
                            }}
                        >
                            Gestion médicale
                        </div>
                    </div>
                </Link>

                <div className="navbar-nav ms-auto">

                    <Link className="nav-link" to="/">
                        <i className="bi bi-speedometer2 me-2"></i>
                        Dashboard
                    </Link>

                    <Link className="nav-link" to="/patients">
                        <i className="bi bi-people-fill me-2"></i>
                        Patients
                    </Link>

                    <Link className="nav-link" to="/medecins">
                        <i className="bi bi-person-vcard-fill me-2"></i>
                        Médecins
                    </Link>

                    <Link className="nav-link" to="/specialites">
                        <i className="bi bi-heart-pulse-fill me-2"></i>
                        Spécialités
                    </Link>

                    <Link className="nav-link" to="/rendez-vous">
                        <i className="bi bi-calendar-check-fill me-2"></i>
                        Rendez-vous
                    </Link>

                </div>

            </div>
        </nav>
    );
}

export default Navbar;
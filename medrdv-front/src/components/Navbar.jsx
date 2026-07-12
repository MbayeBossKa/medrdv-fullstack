import { Link } from "react-router-dom";
import api from "../api/api";
import logo from "../assets/logo.png";
const user = JSON.parse(localStorage.getItem("user"));

const handleLogout = async () => {
    try {
        await api.post("/logout");
    } catch (error) {
        console.error("Erreur lors de la déconnexion :", error);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
};

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

                <div className="d-flex align-items-center ms-auto">

                    <div className="navbar-nav">

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
                       
                        <span className="navbar-text text-white ms-3 me-3">
                            <i className="bi bi-person-circle me-2"></i>
                            {user?.name}
                        </span>

                        <button
                            type="button"
                            className="btn btn-outline-light btn-sm align-self-center"
                            onClick={handleLogout}
                        >
                            <i className="bi bi-box-arrow-right me-2"></i>
                            Déconnexion
                        </button>

                    </div>
                </div>

            </div>
        </nav>
    );
}

export default Navbar;
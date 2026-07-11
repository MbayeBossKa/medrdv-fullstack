import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import api from "../api/api";

function Dashboard() {
    const [stats, setStats] = useState({
        patients: 0,
        medecins: 0,
        specialites: 0,
        rendezVous: 0,
    });

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const chargerStatistiques = async () => {
            try {
                const [
                    patientsResponse,
                    medecinsResponse,
                    specialitesResponse,
                    rendezVousResponse,
                ] = await Promise.all([
                    api.get("/patients"),
                    api.get("/medecins"),
                    api.get("/specialites"),
                    api.get("/rendez-vous"),
                ]);

                setStats({
                    patients: patientsResponse.data.length,
                    medecins: medecinsResponse.data.length,
                    specialites: specialitesResponse.data.length,
                    rendezVous: rendezVousResponse.data.length,
                });
            } catch {
                setMessage("Impossible de charger les statistiques.");
            } finally {
                setLoading(false);
            }
        };

        chargerStatistiques();
    }, []);

    const cartes = [
        {
            titre: "Patients",
            valeur: stats.patients,
            icone: "bi-people-fill",
            classe: "text-bg-primary",
            lien: "/patients",
        },
        {
            titre: "Médecins",
            valeur: stats.medecins,
            icone: "bi-person-badge-fill",
            classe: "text-bg-success",
            lien: "/medecins",
        },
        {
            titre: "Spécialités",
            valeur: stats.specialites,
            icone: "bi-heart-pulse-fill",
            classe: "text-bg-info",
            lien: "/specialites",
        },
        {
            titre: "Rendez-vous",
            valeur: stats.rendezVous,
            icone: "bi-calendar-check-fill",
            classe: "text-bg-warning",
            lien: "/rendez-vous",
        },
    ];

    return (
        <div>
            <div className="text-center mb-5">

                <img
                    src={logo}
                    alt="MedRDV"
                    width="110"
                    className="mb-3"
                />

                <h1 className="fw-bold mb-2">
                    Tableau de bord
                </h1>

                <p className="text-muted">
                    Bienvenue sur <strong>MedRDV</strong>, votre plateforme de gestion des rendez-vous médicaux.
                </p>

            </div>

            {message && (
                <div className="alert alert-danger">
                    {message}
                </div>
            )}

            {loading ? (
                <div className="text-center py-5">
                    <div
                        className="spinner-border text-primary"
                        role="status"
                    >
                        <span className="visually-hidden">
                            Chargement...
                        </span>
                    </div>
                </div>
            ) : (
                <>
                    <div className="row g-4 mb-4">
                        {cartes.map((carte) => (
                            <div
                                className="col-sm-6 col-xl-3"
                                key={carte.titre}
                            >
                                <div
                                    className={`card border-0 shadow-lg h-100 ${carte.classe}`}
                                    style={{
                                        borderRadius: "18px",
                                        transition: "0.3s"
                                    }}
                                >
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <p className="mb-1">
                                                    {carte.titre}
                                                </p>

                                                <h2 className="display-6 fw-bold mb-0">
                                                    {carte.valeur}
                                                </h2>
                                            </div>

                                            <i
                                                className={`bi ${carte.icone} fs-1`}
                                            />
                                        </div>
                                    </div>

                                    <div className="card-footer bg-transparent border-0 pt-0">
                                        <Link
                                            to={carte.lien}
                                           className="btn btn-outline-light btn-sm"
                                        >
                                            Consulter
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h2 className="h5 mb-3">
                                Accès rapide
                            </h2>

                            <div className="row g-3">
                                <div className="col-md-6">
                                    <Link
                                        to="/patients"
                                        className="btn btn-outline-primary w-100 py-3"
                                    >
                                        <i className="bi bi-person-plus me-2" />
                                        Ajouter un patient
                                    </Link>
                                </div>

                                <div className="col-md-6">
                                    <Link
                                        to="/rendez-vous"
                                        className="btn btn-outline-success w-100 py-3"
                                    >
                                        <i className="bi bi-calendar-plus me-2" />
                                        Programmer un rendez-vous
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Dashboard;
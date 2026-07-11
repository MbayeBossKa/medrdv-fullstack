import { useEffect, useState } from "react";
import api from "../api/api";

function Patients() {
    const initialForm = {
        nom: "",
        prenom: "",
        telephone: "",
        email: "",
        date_naissance: "",
        sexe: "",
        adresse: "",
    };

    const [patients, setPatients] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [editingId, setEditingId] = useState(null);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const chargerPatients = async () => {
        try {
            setLoading(true);
            const response = await api.get("/patients");
            setPatients(response.data);
        } catch {
            setMessage("Impossible de charger les patients.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        chargerPatients();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((ancienForm) => ({
            ...ancienForm,
            [name]: value,
        }));
    };

    const resetForm = () => {
        setForm(initialForm);
        setEditingId(null);
        setErrors({});
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrors({});
        setMessage("");

        try {
            if (editingId) {
                await api.put(`/patients/${editingId}`, form);
                setMessage("Patient modifié avec succès.");
            } else {
                await api.post("/patients", form);
                setMessage("Patient ajouté avec succès.");
            }

            resetForm();
            await chargerPatients();
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors ?? {});
            } else {
                setMessage("Une erreur est survenue.");
            }
        }
    };

    const modifierPatient = (patient) => {
        setEditingId(patient.id);

        setForm({
            nom: patient.nom ?? "",
            prenom: patient.prenom ?? "",
            telephone: patient.telephone ?? "",
            email: patient.email ?? "",
            date_naissance: patient.date_naissance ?? "",
            sexe: patient.sexe ?? "",
            adresse: patient.adresse ?? "",
        });

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const supprimerPatient = async (id) => {
        const confirmation = window.confirm(
            "Voulez-vous vraiment supprimer ce patient ?"
        );

        if (!confirmation) {
            return;
        }

        try {
            await api.delete(`/patients/${id}`);
            setMessage("Patient supprimé avec succès.");
            await chargerPatients();
        } catch {
            setMessage("Impossible de supprimer ce patient.");
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="mb-1">Gestion des patients</h1>
                    <p className="text-muted mb-0">
                        Ajouter, modifier et consulter les patients.
                    </p>
                </div>
                <span className="badge text-bg-primary fs-6">
                    {patients.length} patient(s)
                </span>
            </div>

            {message && (
                <div className="alert alert-info">
                    {message}
                </div>
            )}

            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <h2 className="h5 mb-3">
                        {editingId ? "Modifier le patient" : "Ajouter un patient"}
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">Nom</label>
                                <input
                                    type="text"
                                    name="nom"
                                    className={`form-control ${
                                        errors.nom ? "is-invalid" : ""
                                    }`}
                                    value={form.nom}
                                    onChange={handleChange}
                                />
                                {errors.nom && (
                                    <div className="invalid-feedback">
                                        {errors.nom[0]}
                                    </div>
                                )}
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Prénom</label>
                                <input
                                    type="text"
                                    name="prenom"
                                    className={`form-control ${
                                        errors.prenom ? "is-invalid" : ""
                                    }`}
                                    value={form.prenom}
                                    onChange={handleChange}
                                />
                                {errors.prenom && (
                                    <div className="invalid-feedback">
                                        {errors.prenom[0]}
                                    </div>
                                )}
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Téléphone</label>
                                <input
                                    type="text"
                                    name="telephone"
                                    className={`form-control ${
                                        errors.telephone ? "is-invalid" : ""
                                    }`}
                                    value={form.telephone}
                                    onChange={handleChange}
                                />
                                {errors.telephone && (
                                    <div className="invalid-feedback">
                                        {errors.telephone[0]}
                                    </div>
                                )}
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    className={`form-control ${
                                        errors.email ? "is-invalid" : ""
                                    }`}
                                    value={form.email}
                                    onChange={handleChange}
                                />
                                {errors.email && (
                                    <div className="invalid-feedback">
                                        {errors.email[0]}
                                    </div>
                                )}
                            </div>

                            <div className="col-md-4">
                                <label className="form-label">
                                    Date de naissance
                                </label>
                                <input
                                    type="date"
                                    name="date_naissance"
                                    className="form-control"
                                    value={form.date_naissance}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="form-label">Sexe</label>
                                <select
                                    name="sexe"
                                    className="form-select"
                                    value={form.sexe}
                                    onChange={handleChange}
                                >
                                    <option value="">Choisir</option>
                                    <option value="Masculin">Masculin</option>
                                    <option value="Féminin">Féminin</option>
                                </select>
                            </div>

                            <div className="col-md-4">
                                <label className="form-label">Adresse</label>
                                <input
                                    type="text"
                                    name="adresse"
                                    className="form-control"
                                    value={form.adresse}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <button className="btn btn-primary me-2">
                                {editingId ? "Mettre à jour" : "Enregistrer"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={resetForm}
                                >
                                    Annuler
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            <div className="card shadow-sm">
                <div className="card-body">
                    <h2 className="h5 mb-3">Liste des patients</h2>

                    {loading ? (
                        <p>Chargement...</p>
                    ) : patients.length === 0 ? (
                        <div className="alert alert-light border">
                            Aucun patient enregistré.
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead>
                                    <tr>
                                        <th>Nom complet</th>
                                        <th>Téléphone</th>
                                        <th>Email</th>
                                        <th>Sexe</th>
                                        <th>Adresse</th>
                                        <th className="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {patients.map((patient) => (
                                        <tr key={patient.id}>
                                            <td>
                                                {patient.prenom} {patient.nom}
                                            </td>
                                            <td>{patient.telephone}</td>
                                            <td>{patient.email || "—"}</td>
                                            <td>{patient.sexe || "—"}</td>
                                            <td>{patient.adresse || "—"}</td>
                                            <td className="text-end">
                                                <button
                                                    className="btn btn-warning btn-sm me-2"
                                                    onClick={() =>
                                                        modifierPatient(patient)
                                                    }
                                                >
                                                    Modifier
                                                </button>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() =>
                                                        supprimerPatient(patient.id)
                                                    }
                                                >
                                                    Supprimer
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Patients;
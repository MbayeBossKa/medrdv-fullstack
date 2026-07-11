import { useEffect, useState } from "react";
import api from "../api/api";

function Medecins() {
    const initialForm = {
        specialite_id: "",
        nom: "",
        prenom: "",
        telephone: "",
        email: "",
        numero_ordre: "",
        disponibilite: true,
    };

    const [medecins, setMedecins] = useState([]);
    const [specialites, setSpecialites] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [editingId, setEditingId] = useState(null);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const chargerMedecins = async () => {
        try {
            setLoading(true);

            const response = await api.get("/medecins");

            setMedecins(response.data);
        } catch {
            setMessage("Impossible de charger les médecins.");
        } finally {
            setLoading(false);
        }
    };

    const chargerSpecialites = async () => {
        try {
            const response = await api.get("/specialites");

            setSpecialites(response.data);
        } catch {
            setMessage("Impossible de charger les spécialités.");
        }
    };

    useEffect(() => {
        chargerMedecins();
        chargerSpecialites();
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
            const donnees = {
                ...form,
                specialite_id: Number(form.specialite_id),
                disponibilite: Boolean(form.disponibilite),
            };

            if (editingId) {
                await api.put(`/medecins/${editingId}`, donnees);

                setMessage("Médecin modifié avec succès.");
            } else {
                await api.post("/medecins", donnees);

                setMessage("Médecin ajouté avec succès.");
            }

            resetForm();
            await chargerMedecins();
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors ?? {});
            } else {
                setMessage("Une erreur est survenue.");
            }
        }
    };

    const modifierMedecin = (medecin) => {
        setEditingId(medecin.id);

        setForm({
            specialite_id: medecin.specialite_id ?? "",
            nom: medecin.nom ?? "",
            prenom: medecin.prenom ?? "",
            telephone: medecin.telephone ?? "",
            email: medecin.email ?? "",
            numero_ordre: medecin.numero_ordre ?? "",
            disponibilite: Boolean(medecin.disponibilite),
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const supprimerMedecin = async (id) => {
        const confirmation = window.confirm(
            "Voulez-vous vraiment supprimer ce médecin ?"
        );

        if (!confirmation) {
            return;
        }

        try {
            await api.delete(`/medecins/${id}`);

            setMessage("Médecin supprimé avec succès.");

            await chargerMedecins();
        } catch {
            setMessage("Impossible de supprimer ce médecin.");
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="mb-1">Gestion des médecins</h1>

                    <p className="text-muted mb-0">
                        Ajouter, modifier et consulter les médecins.
                    </p>
                </div>

                <span className="badge text-bg-primary fs-6">
                    {medecins.length} médecin(s)
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
                        {editingId
                            ? "Modifier le médecin"
                            : "Ajouter un médecin"}
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">
                                    Spécialité
                                </label>

                                <select
                                    name="specialite_id"
                                    className={`form-select ${errors.specialite_id
                                            ? "is-invalid"
                                            : ""
                                        }`}
                                    value={form.specialite_id}
                                    onChange={handleChange}
                                >
                                    <option value="">
                                        Choisir une spécialité
                                    </option>

                                    {specialites.map((specialite) => (
                                        <option
                                            key={specialite.id}
                                            value={specialite.id}
                                        >
                                            {specialite.nom}
                                        </option>
                                    ))}
                                </select>

                                {errors.specialite_id && (
                                    <div className="invalid-feedback">
                                        {errors.specialite_id[0]}
                                    </div>
                                )}
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Nom</label>

                                <input
                                    type="text"
                                    name="nom"
                                    className={`form-control ${errors.nom ? "is-invalid" : ""
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
                                    className={`form-control ${errors.prenom ? "is-invalid" : ""
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
                                <label className="form-label">
                                    Téléphone
                                </label>

                                <input
                                    type="text"
                                    name="telephone"
                                    className={`form-control ${errors.telephone
                                            ? "is-invalid"
                                            : ""
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
                                    className={`form-control ${errors.email ? "is-invalid" : ""
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

                            <div className="col-md-6">
                                <label className="form-label">
                                    Numéro d’ordre
                                </label>

                                <input
                                    type="text"
                                    name="numero_ordre"
                                    className={`form-control ${errors.numero_ordre
                                            ? "is-invalid"
                                            : ""
                                        }`}
                                    value={form.numero_ordre}
                                    onChange={handleChange}
                                />

                                {errors.numero_ordre && (
                                    <div className="invalid-feedback">
                                        {errors.numero_ordre[0]}
                                    </div>
                                )}
                            </div>

                            <div className="col-md-6">
                                <div className="form-check mt-4">
                                    <input
                                        type="checkbox"
                                        name="disponibilite"
                                        id="disponibilite"
                                        className="form-check-input"
                                        checked={form.disponibilite}
                                        onChange={(event) =>
                                            setForm((ancienForm) => ({
                                                ...ancienForm,
                                                disponibilite:
                                                    event.target.checked,
                                            }))
                                        }
                                    />

                                    <label
                                        className="form-check-label"
                                        htmlFor="disponibilite"
                                    >
                                        Médecin disponible
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <button className="btn btn-primary me-2">
                                {editingId
                                    ? "Mettre à jour"
                                    : "Enregistrer"}
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
                    <h2 className="h5 mb-3">
                        Liste des médecins
                    </h2>

                    {loading ? (
                        <p>Chargement...</p>
                    ) : medecins.length === 0 ? (
                        <div className="alert alert-light border">
                            Aucun médecin enregistré.
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead>
                                    <tr>
                                        <th>Nom complet</th>
                                        <th>Spécialité</th>
                                        <th>Téléphone</th>
                                        <th>Email</th>
                                        <th>Disponibilité</th>
                                        <th>Numéro d’ordre</th>
                                        <th className="text-end">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {medecins.map((medecin) => (
                                        <tr key={medecin.id}>
                                            <td>
                                                {medecin.prenom}{" "}
                                                {medecin.nom}
                                            </td>

                                            <td>
                                                {medecin.specialite?.nom ||
                                                    "—"}
                                            </td>

                                            <td>
                                                {medecin.telephone || "—"}
                                            </td>

                                            <td>
                                                {medecin.email || "—"}
                                            </td>

                                            <td>
                                                <span
                                                    className={`badge ${medecin.disponibilite
                                                            ? "text-bg-success"
                                                            : "text-bg-secondary"
                                                        }`}
                                                >
                                                    {medecin.disponibilite
                                                        ? "Disponible"
                                                        : "Indisponible"}
                                                </span>
                                            </td>

                                            <td>
                                                {medecin.numero_ordre ||
                                                    "—"}
                                            </td>

                                            <td className="text-end">
                                                <button
                                                    className="btn btn-warning btn-sm me-2"
                                                    onClick={() =>
                                                        modifierMedecin(
                                                            medecin
                                                        )
                                                    }
                                                >
                                                    Modifier
                                                </button>

                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() =>
                                                        supprimerMedecin(
                                                            medecin.id
                                                        )
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

export default Medecins;
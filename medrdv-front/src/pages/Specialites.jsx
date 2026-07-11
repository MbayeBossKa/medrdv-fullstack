import { useEffect, useState } from "react";
import api from "../api/api";

function Specialites() {
    const initialForm = {
        nom: "",
        description: "",
    };

    const [Specialites, setSpecialites] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [editingId, setEditingId] = useState(null);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const chargerSpecialites = async () => {
        try {
            setLoading(true);
            const response = await api.get("/specialites");
            setSpecialites(response.data);
        } catch {
            setMessage("Impossible de charger les Specialites.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
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
            if (editingId) {
                await api.put(`/specialites/${editingId}`, form);
                setMessage("specialite modifié avec succès.");
            } else {
                await api.post("/specialites", form);
                setMessage("specialite ajouté avec succès.");
            }

            resetForm();
            await chargerSpecialites();
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors ?? {});
            } else {
                setMessage("Une erreur est survenue.");
            }
        }
    };

    const modifierspecialite = (specialite) => {
        setEditingId(specialite.id);

        setForm({
            nom: specialite.nom ?? "",
            description: specialite.description ?? "",
        });

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const supprimerspecialite = async (id) => {
        const confirmation = window.confirm(
            "Voulez-vous vraiment supprimer cette specialite ?"
        );

        if (!confirmation) {
            return;
        }

        try {
            await api.delete(`/specialites/${id}`);
            setMessage("Specialite supprimée avec succès.");
            await chargerSpecialites();
        } catch {
            setMessage("Impossible de supprimer cette specialite.");
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="mb-1">Gestion des Specialites</h1>
                    <p className="text-muted mb-0">
                        Ajouter, modifier et consulter les Specialites.
                    </p>
                </div>
                <span className="badge text-bg-primary fs-6">
                    {Specialites.length} specialite(s)
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
                        {editingId ? "Modifier la specialite" : "Ajouter une specialite"}
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
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
                                <label className="form-label">Description</label>
                                <textarea
                                    name="description"
                                    className={`form-control ${errors.description ? "is-invalid" : ""
                                        }`}
                                    rows="3"
                                    value={form.description}
                                    onChange={handleChange}
                                />
                                {errors.description && (
                                    <div className="invalid-feedback">
                                        {errors.description[0]}
                                    </div>
                                )}
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
                    <h2 className="h5 mb-3">Liste des Specialites</h2>

                    {loading ? (
                        <p>Chargement...</p>
                    ) : Specialites.length === 0 ? (
                        <div className="alert alert-light border">
                            Aucun specialite enregistré.
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead>
                                    <tr>
                                        <th>Nom</th>
                                        <th>Description</th>


                                        <th className="text-end" style={{ width: "180px" }}>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Specialites.map((specialite) => (
                                        <tr key={specialite.id}>
                                            <td>{specialite.nom || "—"}</td>
                                            <td>{specialite.description || "—"}</td>
                                            <td className="text-end">
                                                <div className="d-flex justify-content-end gap-2">
                                                    <button
                                                        className="btn btn-warning btn-sm"
                                                        onClick={() => modifierSpecialite(specialite)}
                                                    >
                                                        Modifier
                                                    </button>

                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => supprimerSpecialite(specialite.id)}
                                                    >
                                                        Supprimer
                                                    </button>
                                                </div>
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

export default Specialites;
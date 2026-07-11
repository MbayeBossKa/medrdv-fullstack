import { useEffect, useState } from "react";

import api from "../api/api";

function RendezVous() {

    const initialForm = {

        patient_id: "",

        medecin_id: "",

        date_rendez_vous: "",

        heure_rendez_vous: "",

        motif: "",

        statut: "programmé",

        observations: "",

    };

    const [rendezVous, setRendezVous] = useState([]);

    const [patients, setPatients] = useState([]);

    const [medecins, setMedecins] = useState([]);

    const [form, setForm] = useState(initialForm);

    const [editingId, setEditingId] = useState(null);

    const [errors, setErrors] = useState({});

    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(true);

    const chargerRendezVous = async () => {

        try {

            setLoading(true);

            const response = await api.get("/rendez-vous");

            setRendezVous(response.data);

        } catch {

            setMessage("Impossible de charger les rendez-vous.");

        } finally {

            setLoading(false);

        }

    };

    const chargerPatients = async () => {

        try {

            const response = await api.get("/patients");

            setPatients(response.data);

        } catch {

            setMessage("Impossible de charger les patients.");

        }

    };

    const chargerMedecins = async () => {

        try {

            const response = await api.get("/medecins");

            setMedecins(response.data);

        } catch {

            setMessage("Impossible de charger les médecins.");

        }

    };

    useEffect(() => {

        chargerRendezVous();

        chargerPatients();

        chargerMedecins();

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

        const donnees = {

            ...form,

            patient_id: Number(form.patient_id),

            medecin_id: Number(form.medecin_id),

        };

        try {

            if (editingId) {

                await api.put(`/rendez-vous/${editingId}`, donnees);

                setMessage("Rendez-vous modifié avec succès.");

            } else {

                await api.post("/rendez-vous", donnees);

                setMessage("Rendez-vous ajouté avec succès.");

            }

            resetForm();

            await chargerRendezVous();

        } catch (error) {

            if (error.response?.status === 422) {

                setErrors(error.response.data.errors ?? {});

            } else {

                setMessage("Une erreur est survenue.");

            }

        }

    };

    const modifierRendezVous = (rendezVousSelectionne) => {

        setEditingId(rendezVousSelectionne.id);

        setForm({

            patient_id: rendezVousSelectionne.patient_id ?? "",

            medecin_id: rendezVousSelectionne.medecin_id ?? "",

            date_rendez_vous:

                rendezVousSelectionne.date_rendez_vous?.slice(0, 10) ?? "",

            heure_rendez_vous:

                rendezVousSelectionne.heure_rendez_vous?.slice(0, 5) ?? "",

            motif: rendezVousSelectionne.motif ?? "",

            statut: rendezVousSelectionne.statut ?? "programmé",

            observations: rendezVousSelectionne.observations ?? "",

        });

        window.scrollTo({

            top: 0,

            behavior: "smooth",

        });

    };

    const supprimerRendezVous = async (id) => {

        const confirmation = window.confirm(

            "Voulez-vous vraiment supprimer ce rendez-vous ?"

        );

        if (!confirmation) {

            return;

        }

        try {

            await api.delete(`/rendez-vous/${id}`);

            setMessage("Rendez-vous supprimé avec succès.");

            await chargerRendezVous();

        } catch {

            setMessage("Impossible de supprimer ce rendez-vous.");

        }

    };

    const classeStatut = (statut) => {

        switch (statut) {

            case "confirmé":

                return "text-bg-success";

            case "terminé":

                return "text-bg-secondary";

            case "annulé":

                return "text-bg-danger";

            default:

                return "text-bg-warning";

        }

    };

    return (

        <div>

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h1 className="mb-1">Gestion des rendez-vous</h1>

                    <p className="text-muted mb-0">

                        Ajouter, modifier et consulter les rendez-vous médicaux.

                    </p>

                </div>

                <span className="badge text-bg-primary fs-6">

                    {rendezVous.length} rendez-vous

                </span>

            </div>

            {message && <div className="alert alert-info">{message}</div>}

            <div className="card shadow-sm mb-4">

                <div className="card-body">

                    <h2 className="h5 mb-3">

                        {editingId

                            ? "Modifier le rendez-vous"

                            : "Ajouter un rendez-vous"}

                    </h2>

                    <form onSubmit={handleSubmit}>

                        <div className="row g-3">

                            <div className="col-md-6">

                                <label className="form-label">Patient</label>

                                <select

                                    name="patient_id"

                                    className={`form-select ${

                                        errors.patient_id ? "is-invalid" : ""

                                    }`}

                                    value={form.patient_id}

                                    onChange={handleChange}

                                >

                                    <option value="">Choisir un patient</option>

                                    {patients.map((patient) => (

                                        <option

                                            key={patient.id}

                                            value={patient.id}

                                        >

                                            {patient.prenom} {patient.nom}

                                        </option>

                                    ))}

                                </select>

                                {errors.patient_id && (

                                    <div className="invalid-feedback">

                                        {errors.patient_id[0]}

                                    </div>

                                )}

                            </div>

                            <div className="col-md-6">

                                <label className="form-label">Médecin</label>

                                <select

                                    name="medecin_id"

                                    className={`form-select ${

                                        errors.medecin_id ? "is-invalid" : ""

                                    }`}

                                    value={form.medecin_id}

                                    onChange={handleChange}

                                >

                                    <option value="">Choisir un médecin</option>

                                    {medecins.map((medecin) => (

                                        <option

                                            key={medecin.id}

                                            value={medecin.id}

                                        >

                                            Dr {medecin.prenom} {medecin.nom}

                                            {medecin.specialite?.nom

                                                ? ` — ${medecin.specialite.nom}`

                                                : ""}

                                        </option>

                                    ))}

                                </select>

                                {errors.medecin_id && (

                                    <div className="invalid-feedback">

                                        {errors.medecin_id[0]}

                                    </div>

                                )}

                            </div>

                            <div className="col-md-4">

                                <label className="form-label">Date</label>

                                <input

                                    type="date"

                                    name="date_rendez_vous"

                                    className={`form-control ${

                                        errors.date_rendez_vous

                                            ? "is-invalid"

                                            : ""

                                    }`}

                                    value={form.date_rendez_vous}

                                    onChange={handleChange}

                                />

                                {errors.date_rendez_vous && (

                                    <div className="invalid-feedback">

                                        {errors.date_rendez_vous[0]}

                                    </div>

                                )}

                            </div>

                            <div className="col-md-4">

                                <label className="form-label">Heure</label>

                                <input

                                    type="time"

                                    name="heure_rendez_vous"

                                    className={`form-control ${

                                        errors.heure_rendez_vous

                                            ? "is-invalid"

                                            : ""

                                    }`}

                                    value={form.heure_rendez_vous}

                                    onChange={handleChange}

                                />

                                {errors.heure_rendez_vous && (

                                    <div className="invalid-feedback">

                                        {errors.heure_rendez_vous[0]}

                                    </div>

                                )}

                            </div>

                            <div className="col-md-4">

                                <label className="form-label">Statut</label>

                                <select

                                    name="statut"

                                    className={`form-select ${

                                        errors.statut ? "is-invalid" : ""

                                    }`}

                                    value={form.statut}

                                    onChange={handleChange}

                                >

                                    <option value="programmé">Programmé</option>

                                    <option value="confirmé">Confirmé</option>

                                    <option value="terminé">Terminé</option>

                                    <option value="annulé">Annulé</option>

                                </select>

                                {errors.statut && (

                                    <div className="invalid-feedback">

                                        {errors.statut[0]}

                                    </div>

                                )}

                            </div>

                            <div className="col-md-6">

                                <label className="form-label">Motif</label>

                                <textarea

                                    name="motif"

                                    rows="3"

                                    className={`form-control ${

                                        errors.motif ? "is-invalid" : ""

                                    }`}

                                    value={form.motif}

                                    onChange={handleChange}

                                />

                                {errors.motif && (

                                    <div className="invalid-feedback">

                                        {errors.motif[0]}

                                    </div>

                                )}

                            </div>

                            <div className="col-md-6">

                                <label className="form-label">

                                    Observations

                                </label>

                                <textarea

                                    name="observations"

                                    rows="3"

                                    className={`form-control ${

                                        errors.observations

                                            ? "is-invalid"

                                            : ""

                                    }`}

                                    value={form.observations}

                                    onChange={handleChange}

                                />

                                {errors.observations && (

                                    <div className="invalid-feedback">

                                        {errors.observations[0]}

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

                    <h2 className="h5 mb-3">Liste des rendez-vous</h2>

                    {loading ? (

                        <p>Chargement...</p>

                    ) : rendezVous.length === 0 ? (

                        <div className="alert alert-light border">

                            Aucun rendez-vous enregistré.

                        </div>

                    ) : (

                        <div className="table-responsive">

                            <table className="table table-hover align-middle">

                                <thead>

                                    <tr>

                                        <th>Patient</th>

                                        <th>Médecin</th>

                                        <th>Date</th>

                                        <th>Heure</th>

                                        <th>Motif</th>

                                        <th>Statut</th>

                                        <th className="text-end">Actions</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {rendezVous.map((rendezVousItem) => (

                                        <tr key={rendezVousItem.id}>

                                            <td>

                                                {rendezVousItem.patient

                                                    ? `${rendezVousItem.patient.prenom} ${rendezVousItem.patient.nom}`

                                                    : "—"}

                                            </td>

                                            <td>

                                                {rendezVousItem.medecin

                                                    ? `Dr ${rendezVousItem.medecin.prenom} ${rendezVousItem.medecin.nom}`

                                                    : "—"}

                                            </td>

                                            <td>

                                                {rendezVousItem.date_rendez_vous

                                                    ? new Date(

                                                          rendezVousItem.date_rendez_vous

                                                      ).toLocaleDateString(

                                                          "fr-FR"

                                                      )

                                                    : "—"}

                                            </td>

                                            <td>

                                                {rendezVousItem.heure_rendez_vous?.slice(

                                                    0,

                                                    5

                                                ) || "—"}

                                            </td>

                                            <td>{rendezVousItem.motif}</td>

                                            <td>

                                                <span

                                                    className={`badge ${classeStatut(

                                                        rendezVousItem.statut

                                                    )}`}

                                                >

                                                    {rendezVousItem.statut}

                                                </span>

                                            </td>

                                            <td className="text-end">

                                                <button

                                                    className="btn btn-warning btn-sm me-2"

                                                    onClick={() =>

                                                        modifierRendezVous(

                                                            rendezVousItem

                                                        )

                                                    }

                                                >

                                                    Modifier

                                                </button>

                                                <button

                                                    className="btn btn-danger btn-sm"

                                                    onClick={() =>

                                                        supprimerRendezVous(

                                                            rendezVousItem.id

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

export default RendezVous;
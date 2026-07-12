import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import logo from "../assets/logo.png";

function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");

        try {
            const response = await api.post("/login", form);

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            navigate("/");
      } catch (error) {
    console.error("Erreur de connexion :", error.response?.data || error.message);

    if (error.response?.status === 422) {
        setMessage(
            error.response.data.errors?.email?.[0] ||
            "Email ou mot de passe incorrect."
        );
    } else if (error.response?.status === 401) {
        setMessage("Email ou mot de passe incorrect.");
    } else {
        setMessage("Impossible de contacter le serveur Laravel.");
    }
}
    };

    return (
        <div
            className="container d-flex justify-content-center align-items-center"
            style={{ minHeight: "100vh" }}
        >
            <div className="card shadow p-4" style={{ width: "420px" }}>

                <div className="text-center mb-4">
                    <img
                        src={logo}
                        alt="MedRDV"
                        width="90"
                    />

                    <h2 className="mt-3">
                        MedRDV
                    </h2>

                    <p className="text-muted">
                        Connexion
                    </p>
                </div>

                {message && (
                    <div className="alert alert-danger">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="mb-3">
                        <label>Email</label>

                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-4">
                        <label>Mot de passe</label>

                        <input
                            type="password"
                            className="form-control"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        className="btn btn-primary w-100"
                    >
                        Se connecter
                    </button>

                </form>

            </div>
        </div>
    );
}

export default Login;
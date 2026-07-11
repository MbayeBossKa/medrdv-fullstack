import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Medecins from "./pages/Medecins";
import Specialites from "./pages/Specialites";
import RendezVous from "./pages/RendezVous";

import Navbar from "./components/Navbar";

function App() {
    return (
        <BrowserRouter>

            <Navbar />

            <div className="container mt-4">

                <Routes>

                    <Route path="/" element={<Dashboard />} />

                    <Route path="/patients" element={<Patients />} />

                    <Route path="/medecins" element={<Medecins />} />

                    <Route path="/specialites" element={<Specialites />} />

                    <Route path="/rendez-vous" element={<RendezVous />} />

                </Routes>

            </div>

        </BrowserRouter>
    );
}

export default App;
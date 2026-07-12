import {
    BrowserRouter,
    Navigate,
    Outlet,
    Route,
    Routes,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Medecins from "./pages/Medecins";
import Specialites from "./pages/Specialites";
import RendezVous from "./pages/RendezVous";
import Login from "./pages/Login";

import Navbar from "./components/Navbar";

function RouteProtegee() {
    const token = localStorage.getItem("token");

    return token ? <Outlet /> : <Navigate to="/login" replace />;
}

function LayoutProtege() {
    return (
        <>
            <Navbar />

            <main className="container mt-4">
                <Outlet />
            </main>
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route element={<RouteProtegee />}>
                    <Route element={<LayoutProtege />}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/patients" element={<Patients />} />
                        <Route path="/medecins" element={<Medecins />} />
                        <Route
                            path="/specialites"
                            element={<Specialites />}
                        />
                        <Route
                            path="/rendez-vous"
                            element={<RendezVous />}
                        />
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
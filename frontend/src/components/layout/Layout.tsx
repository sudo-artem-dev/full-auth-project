import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout() {
    return (
        <div className="flex h-screen bg-gray-100">
            
            {/* Sidebar */}
            <Sidebar />

            {/* Contenu principal */}
            <div className="flex flex-col flex-1">

                {/* Navbar */}
                <Navbar />

                {/* Zone de contenu */}
                <main className="flex-1 p-6 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

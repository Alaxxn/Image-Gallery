import { Header } from "./Header.tsx";
import { Outlet } from "react-router";

export function MainLayout() {
    return (
        <div>
            <Header />
            <Outlet />
        </div>
    );
}

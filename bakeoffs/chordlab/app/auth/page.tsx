import Link from "next/link";
import { AuthPanel } from "../../src/components/AuthPanel";
import { NavBar } from "../../src/components/NavBar";

export default function login() {
    return (
        <div className="app-shell">
            <header className="site-header">
                <Link className="brand" href="/" aria-label="ChordLab home">
                    ChordLab
                </Link>
                <NavBar/>
            </header>
            <div className="page-content">
                <AuthPanel />
            </div>
        </div>
    );
}

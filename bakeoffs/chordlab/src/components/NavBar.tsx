import { AuthNavLink } from "./ui/AuthNavLink";

export function NavBar() {
    return (
        <nav className="main-nav" aria-label="Main navigation">
            <a className="nav-link" href="/">
                Home
            </a>
            <a className="nav-link" href="/workspaces">
                Workspaces
            </a>
            <AuthNavLink />
        </nav>
    );

}
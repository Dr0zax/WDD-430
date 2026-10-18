import Link from "next/link";
import { AuthNavLink } from "./ui/AuthNavLink";

export function NavBar() {
    return (
        <nav className="main-nav" aria-label="Main navigation">
            <Link className="nav-link" href="/">
                Home
            </Link>
            <AuthNavLink />
        </nav>
    );

}

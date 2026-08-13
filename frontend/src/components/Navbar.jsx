import { NavLink } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand" aria-label="AniTaste home">
          <span className="navbar-brand-icon" aria-hidden="true">味</span>
          <span className="navbar-brand-text">AniTaste</span>
        </NavLink>

        <div className="navbar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}
          >
            Home
          </NavLink>
          <NavLink
            to="/explore"
            className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}
          >
            Explore
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

// src/components/Navbar.jsx
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/new', label: 'Journal', icon: '✏️' },
  { to: '/history', label: 'History', icon: '📖' },
  { to: '/insights', label: 'Insights', icon: '✨' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="nav">
      <a href="/" className="nav-logo">Mind<span>Mate</span></a>
      <div className="nav-links">
        {links.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === '/'}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            {l.icon} <span>{l.label}</span>
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          className="btn btn-ghost"
          style={{ marginLeft: 8, padding: '7px 14px', fontSize: '0.88rem' }}
        >
          Sign out
        </button>
      </div>
    </nav>
  )
}
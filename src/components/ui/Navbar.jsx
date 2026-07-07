export default function Navbar({ scrolled, onLogoClick, activeChapter, onChapterClick }) {
  const navItems = [
    { label: 'Creation', index: 0 },
    { label: 'The Fall', index: 1 },
    { label: 'Noah', index: 2 },
    { label: 'Abraham', index: 3 },
    { label: 'Exodus', index: 4 },
    { label: 'Sanctuary', index: 5 },
    { label: 'David', index: 6 },
    { label: 'Prophecy', index: 7 },
  ]

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <button className="navbar__logo" onClick={onLogoClick} aria-label="Back to top">
        {/* Thread mark instead of cross icon */}
        <span className="navbar__logo-mark" aria-hidden="true" />
        <span className="navbar__logo-text">The Scarlet Thread</span>
      </button>

      <ul className="navbar__links">
        {navItems.map((item) => (
          <li key={item.index}>
            <button
              className={`navbar__link ${activeChapter === item.index ? 'navbar__link--active' : ''}`}
              onClick={() => onChapterClick(item.index)}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

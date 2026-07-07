export default function Footer() {
  return (
    <footer className="footer">
      <p className="footer__teaser">
        The story continues... in the <span className="footer__teaser-highlight">New Testament</span>
      </p>
      <div className="footer__divider" />
      <p className="footer__credits">
        The Scarlet Thread &copy; {new Date().getFullYear()}
      </p>
      <p className="footer__credits" style={{ marginTop: '8px', opacity: 0.5 }}>
        A portfolio piece built on the principles of The Foundation
      </p>
    </footer>
  )
}

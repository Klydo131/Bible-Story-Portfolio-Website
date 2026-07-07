export default function About() {
  return (
    <section className="about" id="about">
      <div className="about__inner">
        <p className="about__label">About This Project</p>
        <h2 className="about__title">Built for His Glory</h2>
        <p className="about__text">
          This interactive experience was created as a portfolio demonstration for
          {' '}<a href="https://awr.org" target="_blank" rel="noopener noreferrer">Adventist World Radio (AWR)</a>,
          showcasing how modern web technology can serve the mission of sharing
          the gospel with the world. Every story, every scripture, every visual
          element is designed to point hearts toward Jesus.
        </p>
        <p className="about__text">
          The Old Testament is not a collection of disconnected stories — it is one
          continuous narrative of God's relentless love, patiently preparing the
          world for the coming of His Son. This is the Scarlet Thread that runs
          from Genesis to Revelation.
        </p>

        <div className="about__badges">
          <div className="about__badge">
            <span className="about__badge-icon">📖</span>
            <span>8 Old Testament Stories</span>
          </div>
          <div className="about__badge">
            <span className="about__badge-icon">✝</span>
            <span>Every Story Points to Jesus</span>
          </div>
          <div className="about__badge">
            <span className="about__badge-icon">🌍</span>
            <span>Built for AWR</span>
          </div>
          <div className="about__badge">
            <span className="about__badge-icon">💡</span>
            <span>Interactive 3D Experience</span>
          </div>
        </div>
      </div>
    </section>
  )
}

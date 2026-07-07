export default function About() {
  return (
    <section className="about" id="about">
      <div className="about__inner">
        <p className="about__label">About This Project</p>
        <h2 className="about__title">A Demonstration of What Is Possible</h2>
        <p className="about__text">
          This interactive experience was built as a portfolio concept for
          {' '}<a href="https://awr.org" target="_blank" rel="noopener noreferrer">Adventist World Radio</a>.
          It explores how modern web technology can serve the mission of sharing
          Scripture with the world, not as a replacement for the Word itself,
          but as a gateway that invites people to open it.
        </p>
        <p className="about__text">
          The Old Testament is not a collection of disconnected ancient stories.
          It is one continuous narrative of a God who never stopped reaching
          toward His people, patiently preparing the world for the coming of
          His Son. That thread of redemption is what this project traces.
        </p>

        <div className="about__badges">
          <div className="about__badge">
            <span className="about__badge-icon">📖</span>
            <span>8 Old Testament Chapters</span>
          </div>
          <div className="about__badge">
            <span className="about__badge-icon">🎨</span>
            <span>Interactive 3D Scenes</span>
          </div>
          <div className="about__badge">
            <span className="about__badge-icon">🌍</span>
            <span>Built for AWR</span>
          </div>
          <div className="about__badge">
            <span className="about__badge-icon">📜</span>
            <span>Scripture-Grounded Narrative</span>
          </div>
        </div>
      </div>
    </section>
  )
}

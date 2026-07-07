export default function About() {
  return (
    <section className="about" id="about">
      <div className="about__inner">
        <p className="about__label">About This Project</p>
        <h2 className="about__title">A Demonstration of What Is Possible</h2>
        <p className="about__text">
          This interactive experience is an exploration of narrative web design.
          It demonstrates how modern web technology can serve the purpose of sharing
          ancient Scripture with a digital world, acting not as a replacement for the
          Word itself, but as a visual gateway that invites deeper reflection.
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
            <span className="about__badge-icon">✨</span>
            <span>Interactive WebGL</span>
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

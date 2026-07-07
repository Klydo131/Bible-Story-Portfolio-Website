import HeroCanvas from '../canvas/HeroCanvas'

export default function Hero() {
  return (
    <section className="hero" id="hero">
      {/* 3D Interactive background */}
      <HeroCanvas />

      {/* Hero Foreground Content */}
      <div className="hero__content">
        <p className="hero__eyebrow">A Portfolio for Adventist World Radio</p>
        <h1 className="hero__title">
          The Scarlet
          <span className="hero__title-accent">Thread</span>
        </h1>
        <p className="hero__subtitle">
          Tracing God's plan of redemption through the stories
          of the Old Testament.
        </p>
      </div>

      <div className="hero__scroll-indicator">
        <span className="hero__scroll-text">Begin the Journey</span>
        <div className="hero__scroll-line" />
        <div className="hero__scroll-dot" />
      </div>
    </section>
  )
}

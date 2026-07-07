export default function ChapterSection({
  story,
  index,
  progress,
  visibility = 0,
  yOffset = 40,
  isActive,
  reverse,
  children
}) {
  return (
    <section
      className={`chapter ${reverse ? 'chapter--reverse' : ''}`}
      id={`chapter-${story.id}`}
      style={{
        '--chapter-color': story.color,
        '--chapter-accent': story.accentColor,
      }}
    >
      <div className="chapter__inner">
        {/* Text Content with scroll-driven CSS variables */}
        <div
          className="chapter__content"
          style={{
            '--section-visibility': visibility,
            '--section-offset': `${yOffset}px`,
          }}
        >
          <div className="chapter__header">
            <span className="chapter__number">{String(story.chapter).padStart(2, '0')}</span>
            <span className="chapter__label">Chapter {story.chapter}</span>
          </div>

          <h2 className="chapter__title">{story.title}</h2>
          <p className="chapter__narrative">{story.narrative}</p>

          <div className="chapter__scripture-block">
            <p className="chapter__scripture">{story.scripture}</p>
            <span className="chapter__scripture-ref">{story.scriptureRef}</span>
          </div>

          <div className="chapter__connection">
            <span className="chapter__connection-icon">✝</span>
            <div>
              <p className="chapter__connection-label">{story.jesusLabel}</p>
              <p className="chapter__connection-text">{story.jesusConnection}</p>
            </div>
          </div>
        </div>

        {/* 3D Scene — passed as children */}
        {children}
      </div>
    </section>
  )
}

export default function ChapterNav({ stories, activeChapter, scrollPercent = 0, onDotClick }) {
  return (
    <div className="chapter-nav" role="navigation" aria-label="Chapter navigation">
      {/* Scrolling progress track connector */}
      <div className="chapter-nav__progress-wrapper">
        <div
          className="chapter-nav__progress-fill"
          style={{ height: `${scrollPercent * 100}%` }}
        />
      </div>

      {stories.map((story, index) => (
        <div key={story.id} className="chapter-nav__item">
          <button
            className={`chapter-nav__dot ${activeChapter === index ? 'chapter-nav__dot--active' : ''}`}
            onClick={() => onDotClick(index)}
            aria-label={`Chapter ${story.chapter}: ${story.title}`}
            title={story.title}
          >
            <span className="chapter-nav__tooltip">{story.title}</span>
          </button>
        </div>
      ))}
    </div>
  )
}

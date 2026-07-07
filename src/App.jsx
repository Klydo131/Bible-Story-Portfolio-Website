import { useState, useEffect, useRef, useCallback, Suspense, lazy } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import Loader from './components/ui/Loader'
import Navbar from './components/ui/Navbar'
import ChapterNav from './components/ui/ChapterNav'
import Hero from './components/sections/Hero'
import ChapterSection from './components/sections/ChapterSection'
import About from './components/sections/About'
import Footer from './components/sections/Footer'
import { SceneEntrance, SceneRig } from './components/canvas/SceneMotion'
import usePrefersReducedMotion from './hooks/usePrefersReducedMotion'
import stories from './constants/stories'

/* Lazy-load 3D scenes for performance */
const CreationScene = lazy(() => import('./components/canvas/CreationScene'))
const FallScene = lazy(() => import('./components/canvas/FallScene'))
const NoahScene = lazy(() => import('./components/canvas/NoahScene'))
const AbrahamScene = lazy(() => import('./components/canvas/AbrahamScene'))
const ExodusScene = lazy(() => import('./components/canvas/ExodusScene'))
const SanctuaryScene = lazy(() => import('./components/canvas/SanctuaryScene'))
const DavidScene = lazy(() => import('./components/canvas/DavidScene'))
const ProphecyScene = lazy(() => import('./components/canvas/ProphecyScene'))

const sceneComponents = [
  CreationScene,
  FallScene,
  NoahScene,
  AbrahamScene,
  ExodusScene,
  SanctuaryScene,
  DavidScene,
  ProphecyScene,
]

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeChapter, setActiveChapter] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()
  
  const [scrollPercent, setScrollPercent] = useState(0)
  const [chapterProgresses, setChapterProgresses] = useState(
    () => new Array(stories.length).fill(0)
  )
  const [chapterVisibilities, setChapterVisibilities] = useState(
    () => new Array(stories.length).fill(0)
  )
  const [chapterOffsets, setChapterOffsets] = useState(
    () => new Array(stories.length).fill(0)
  )

  const sectionRefs = useRef([])
  const heroRef = useRef(null)

  /* Handle scroll for navbar state and chapter tracking */
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 80)

    // Global Scroll Percent for dot navigation connector track
    const totalScrollHeight = document.documentElement.scrollHeight - window.innerHeight
    const globalPercent = totalScrollHeight > 0 ? window.scrollY / totalScrollHeight : 0
    setScrollPercent(globalPercent)

    /* Calculate which chapter is active and each chapter's progress */
    const viewportHeight = window.innerHeight
    const newProgresses = new Array(stories.length).fill(0)
    const newVisibilities = new Array(stories.length).fill(0)
    const newOffsets = new Array(stories.length).fill(0)
    let newActive = 0

    sectionRefs.current.forEach((ref, i) => {
      if (!ref) return
      const rect = ref.getBoundingClientRect()
      const sectionHeight = rect.height

      /* Progress: 0 when entering bottom of screen, 1 when top reaches top of viewport (centered) */
      const rawProgress = (window.innerHeight - rect.top) / window.innerHeight
      newProgresses[i] = Math.max(0, Math.min(1, rawProgress))

      /* Visibility fade in/out mapping:
         - 0 when entering bottom (rect.top = window.innerHeight)
         - 1 when centered (rect.top = 0)
         - 0 when exiting top (rect.top = -rect.height)
      */
      let vis = 0
      let offset = 40
      if (rect.top > 0) {
        // Entering from bottom
        vis = (window.innerHeight - rect.top) / window.innerHeight
        offset = (rect.top / window.innerHeight) * 50
      } else {
        // Exiting from top
        vis = (sectionHeight + rect.top) / sectionHeight
        offset = (rect.top / sectionHeight) * 50
      }
      newVisibilities[i] = Math.max(0, Math.min(1, vis))
      newOffsets[i] = Math.max(-50, Math.min(50, offset))

      /* Active chapter is the one closest to viewport center */
      if (rect.top < viewportHeight * 0.5 && rect.bottom > viewportHeight * 0.3) {
        newActive = i
      }
    })

    setChapterProgresses(newProgresses)
    setChapterVisibilities(newVisibilities)
    setChapterOffsets(newOffsets)
    setActiveChapter(newActive)
  }, [])

  useEffect(() => {
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  /* Simulate loading */
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2200)
    return () => clearTimeout(timer)
  }, [])

  /* Scroll to chapter */
  const scrollToChapter = useCallback((index) => {
    const ref = sectionRefs.current[index]
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [])

  const scrollToHero = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <>
      <Loader isLoading={isLoading} />

      <Navbar
        scrolled={scrolled}
        onLogoClick={scrollToHero}
        activeChapter={activeChapter}
        onChapterClick={scrollToChapter}
      />

      <ChapterNav
        stories={stories}
        activeChapter={activeChapter}
        scrollPercent={scrollPercent}
        onDotClick={scrollToChapter}
      />

      {/* Hero Section */}
      <div ref={heroRef}>
        <Hero />
      </div>

      {/* Chapter Sections with inline 3D canvases */}
      {stories.map((story, index) => {
        const SceneComponent = sceneComponents[index]
        const isNearActiveChapter = Math.abs(activeChapter - index) <= 1
        const motionEnabled = isNearActiveChapter && !prefersReducedMotion
        const progress = chapterProgresses[index]
        const visibility = chapterVisibilities[index]
        const yOffset = chapterOffsets[index]

        return (
          <div
            key={story.id}
            ref={(el) => (sectionRefs.current[index] = el)}
          >
            <ChapterSection
              story={story}
              index={index}
              progress={progress}
              visibility={visibility}
              yOffset={yOffset}
              isActive={activeChapter === index}
              reverse={index % 2 === 1}
            >
              <div className={`chapter__scene ${activeChapter === index ? 'chapter__scene--active' : ''}`}>
                <Canvas
                  dpr={[1, 1.75]}
                  frameloop={motionEnabled ? 'always' : 'demand'}
                  camera={{ position: [0, 0.4, 4.75], fov: 50 }}
                  gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
                  style={{ background: 'transparent' }}
                >
                  <fog attach="fog" args={['#0a1628', 3, 6.5]} />
                  <SceneRig
                    progress={progress}
                    reverse={index % 2 === 1}
                    accentColor={story.accentColor}
                    chapterIndex={index}
                    motionEnabled={motionEnabled}
                  />
                  <Suspense fallback={null}>
                    <ambientLight intensity={0.25} />
                    <SceneEntrance
                      progress={progress}
                      reverse={index % 2 === 1}
                      motionEnabled={motionEnabled}
                    >
                      <SceneComponent progress={progress} />
                    </SceneEntrance>
                  </Suspense>
                </Canvas>
              </div>
            </ChapterSection>
          </div>
        )
      })}

      {/* About & Footer */}
      <About />
      <Footer />
    </>
  )
}

export default App

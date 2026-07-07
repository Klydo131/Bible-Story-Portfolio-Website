import { useEffect, useState } from 'react'

export default function Loader({ isLoading }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isLoading) return
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + Math.random() * 15 + 5
      })
    }, 200)
    return () => clearInterval(interval)
  }, [isLoading])

  return (
    <div className={`loader ${!isLoading ? 'loader--hidden' : ''}`}>
      <div className="loader__glow" />
      <div className="loader__symbol">
        <div className="loader__cross">
          <div className="loader__cross-v" />
          <div className="loader__cross-h" />
        </div>
      </div>
      <p className="loader__text">The Scarlet Thread</p>
      <div className="loader__progress">
        <div
          className="loader__progress-bar"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  )
}

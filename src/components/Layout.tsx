import { useEffect } from 'react'
import { useStore } from '../store/useStore'
import { StartScreen } from './StartScreen'
import { MainInterface } from './MainInterface'

export function Layout() {
  const {showStartScreen,setShowStartScreen} = useStore()

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowStartScreen(false)
    }, 1500)

    return () => clearTimeout(timer) // Cleanup the timer on unmount
  }, [setShowStartScreen])

  return (
    <div className="bg-gray-700 w-full h-full font-mono">
      {showStartScreen ? (
        <StartScreen data-testid="splash-screen" />
      ) : (
        <MainInterface data-testid="main-interface" />
      )}
    </div>
  )
} 
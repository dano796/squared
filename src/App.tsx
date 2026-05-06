import { useGameStore } from './store/gameStore'
import SplashScreen from './components/SplashScreen'
import HomeScreen from './components/HomeScreen'
import LevelSelectScreen from './components/LevelSelectScreen'
import GameScreen from './components/GameScreen'
import LevelCompleteScreen from './components/LevelCompleteScreen'
import GameOverScreen from './components/GameOverScreen'
import CreditsScreen from './components/CreditsScreen'

export default function App() {
  const screen = useGameStore(s => s.screen)

  return (
    <>
      {screen === 'splash' && <SplashScreen />}
      {screen === 'home' && <HomeScreen />}
      {screen === 'levelSelect' && <LevelSelectScreen />}
      {screen === 'game' && <GameScreen />}
      {screen === 'levelComplete' && <LevelCompleteScreen />}
      {screen === 'gameOver' && <GameOverScreen />}
      {screen === 'credits' && <CreditsScreen />}
    </>
  )
}

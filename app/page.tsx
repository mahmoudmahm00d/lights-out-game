import LightsOutGame from "@/components/lights-out-game"
import WaveFooter from "@/components/wave-footer"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-900 to-slate-950">
      <LightsOutGame />
      <WaveFooter />
    </main>
  )
}


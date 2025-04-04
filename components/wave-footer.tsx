"use client"

import { useRef, useEffect } from "react"

export default function WaveFooter() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = 120 // Fixed height for footer
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Wave parameters
    const waves = [
      { amplitude: 15, frequency: 0.02, speed: 0.05, color: "rgba(120, 58, 180, 0.4)" },
      { amplitude: 20, frequency: 0.03, speed: 0.03, color: "rgba(72, 52, 212, 0.3)" },
      { amplitude: 10, frequency: 0.01, speed: 0.07, color: "rgba(29, 38, 113, 0.5)" },
    ]

    let phase = 0

    // Animation loop
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update phase for wave movement
      phase += 0.05

      // Draw each wave
      waves.forEach((wave) => {
        ctx.fillStyle = wave.color
        ctx.beginPath()

        // Start at bottom left
        ctx.moveTo(0, canvas.height)

        // Draw wave path
        for (let x = 0; x < canvas.width; x += 5) {
          const y = canvas.height - wave.amplitude * Math.sin(x * wave.frequency + phase * wave.speed) - 30 // Offset from bottom
          ctx.lineTo(x, y)
        }

        // Complete the path to bottom right
        ctx.lineTo(canvas.width, canvas.height)
        ctx.closePath()
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <div className="fixed bottom-0 left-0 w-full h-[120px] overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="absolute bottom-0 left-0 w-full h-full" />
    </div>
  )
}


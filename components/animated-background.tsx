"use client"

import { useRef, useEffect } from "react"

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Create gradient points
    const points = [
      { x: 0, y: 0, vx: 0.3, vy: 0.2, color: "rgba(120, 58, 180, 0.7)" },
      { x: canvas.width, y: 0, vx: -0.2, vy: 0.3, color: "rgba(29, 38, 113, 0.7)" },
      { x: 0, y: canvas.height, vx: 0.2, vy: -0.3, color: "rgba(72, 52, 212, 0.7)" },
      { x: canvas.width, y: canvas.height, vx: -0.3, vy: -0.2, color: "rgba(95, 10, 135, 0.7)" },
    ]

    // Animation loop
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update points position
      points.forEach((point) => {
        point.x += point.vx
        point.y += point.vy

        // Bounce off edges
        if (point.x <= 0 || point.x >= canvas.width) point.vx *= -1
        if (point.y <= 0 || point.y >= canvas.height) point.vy *= -1
      })

      // Create gradient
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.8,
      )

      // Add color stops based on moving points
      points.forEach((point, index) => {
        const distance = Math.sqrt(Math.pow(point.x - canvas.width / 2, 2) + Math.pow(point.y - canvas.height / 2, 2))
        const normalizedDistance = Math.min(distance / (canvas.width * 0.8), 1)
        gradient.addColorStop((normalizedDistance * (index + 1)) / points.length, point.color)
      })

      // Fill background
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />
}


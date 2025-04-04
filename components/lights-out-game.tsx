"use client"

import { useState, useEffect } from "react"
import { Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"

type Difficulty = "easy" | "medium" | "hard"
type BoardSize = 3 | 4 | 5 | 6
type CellPosition = { row: number; col: number } | null

export default function LightsOutGame() {
  const [boardSize, setBoardSize] = useState<BoardSize>(4)
  const [difficulty, setDifficulty] = useState<Difficulty>("medium")
  const [board, setBoard] = useState<boolean[][]>([])
  const [moves, setMoves] = useState(0)
  const [gameWon, setGameWon] = useState(false)
  const [showSizeChangeDialog, setShowSizeChangeDialog] = useState(false)
  const [pendingSize, setPendingSize] = useState<BoardSize | null>(null)
  const [hoveredCell, setHoveredCell] = useState<CellPosition>(null)
  const { toast } = useToast()

  // Initialize the board
  useEffect(() => {
    initializeBoard()
  }, [boardSize, difficulty])

  // Check for win condition
  useEffect(() => {
    if (board.length > 0 && board.every((row) => row.every((cell) => !cell))) {
      setGameWon(true)
      toast({
        title: "Congratulations!",
        description: `You solved the puzzle in ${moves} moves!`,
        duration: 5000,
      })
    }
  }, [board, moves, toast])

  const initializeBoard = () => {
    // Create an empty board (all cells off)
    let newBoard = Array(boardSize)
      .fill(null)
      .map(() => Array(boardSize).fill(false))

    // Apply random moves to create a solvable puzzle
    const numRandomMoves = getRandomMovesCount(difficulty, boardSize)

    for (let i = 0; i < numRandomMoves; i++) {
      const randomRow = Math.floor(Math.random() * boardSize)
      const randomCol = Math.floor(Math.random() * boardSize)
      newBoard = toggleCellAndNeighbors(newBoard, randomRow, randomCol)
    }

    // Make sure the board is not already solved
    if (newBoard.every((row) => row.every((cell) => !cell))) {
      // If by chance we created a solved board, toggle a random cell
      const randomRow = Math.floor(Math.random() * boardSize)
      const randomCol = Math.floor(Math.random() * boardSize)
      newBoard = toggleCellAndNeighbors(newBoard, randomRow, randomCol)
    }

    setBoard(newBoard)
    setMoves(0)
    setGameWon(false)
  }

  const getRandomMovesCount = (difficulty: Difficulty, size: BoardSize): number => {
    const baseMoves = {
      easy: size,
      medium: size * 2,
      hard: size * 3,
    }

    return baseMoves[difficulty]
  }

  const toggleCellAndNeighbors = (currentBoard: boolean[][], row: number, col: number) => {
    const newBoard = [...currentBoard.map((r) => [...r])]

    // Toggle the clicked cell
    newBoard[row][col] = !newBoard[row][col]

    // Toggle adjacent cells
    const directions = [
      [-1, 0], // up
      [1, 0], // down
      [0, -1], // left
      [0, 1], // right
    ]

    for (const [dx, dy] of directions) {
      const newRow = row + dx
      const newCol = col + dy

      if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
        newBoard[newRow][newCol] = !newBoard[newRow][newCol]
      }
    }

    return newBoard
  }

  const handleCellClick = (row: number, col: number) => {
    if (gameWon) return

    const newBoard = toggleCellAndNeighbors(board, row, col)
    setBoard(newBoard)
    setMoves(moves + 1)
  }

  const handleSizeChange = (newSize: BoardSize) => {
    if (moves === 0 || gameWon) {
      setBoardSize(newSize)
    } else {
      setPendingSize(newSize)
      setShowSizeChangeDialog(true)
    }
  }

  const confirmSizeChange = () => {
    if (pendingSize) {
      setBoardSize(pendingSize)
      setPendingSize(null)
    }
    setShowSizeChangeDialog(false)
  }

  const cancelSizeChange = () => {
    setPendingSize(null)
    setShowSizeChangeDialog(false)
  }

  const resetGame = () => {
    initializeBoard()
  }

  // Check if a cell is a neighbor of the hovered cell
  const isNeighborCell = (row: number, col: number) => {
    if (!hoveredCell) return false

    const directions = [
      [-1, 0], // up
      [1, 0], // down
      [0, 0], // center
      [0, -1], // left
      [0, 1], // right
    ]

    for (const [dx, dy] of directions) {
      const neighborRow = hoveredCell.row + dx
      const neighborCol = hoveredCell.col + dy

      if (row === neighborRow && col === neighborCol) {
        return true
      }
    }

    return false
  }

  return (
    <div className="flex flex-col items-center gap-6 max-w-md w-full mb-[140px]">
      <div className="flex items-center justify-center gap-3">
        <h1 className="text-4xl font-bold text-white mb-2 text-shadow-lg">Lights Out</h1>
      </div>

      <div className="bg-slate-800/30 backdrop-blur-sm p-6 rounded-xl shadow-lg w-full border border-white/10">
        <div className="grid grid-cols-1 gap-4 mb-6">
          <div>
            <h2 className="text-slate-300 mb-2 font-medium">Board Size</h2>
            <div className="flex gap-2">
              {[3, 4, 5, 6].map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeChange(size as BoardSize)}
                  className={cn(
                    "w-10 h-10 rounded-md flex items-center justify-center font-medium transition-all",
                    boardSize === size
                      ? "bg-white text-slate-900 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                      : "bg-slate-700/50 text-white hover:bg-slate-700 backdrop-blur-sm",
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-slate-300">
              Moves: <span className="font-bold text-white">{moves}</span>
            </div>
            <Button
              variant="outline"
              onClick={resetGame}
              className="bg-slate-700/50 text-white hover:bg-slate-600 hover:text-white border-slate-600 backdrop-blur-sm"
            >
              New Game
            </Button>
          </div>

          <div
            className={cn("grid gap-2 mx-auto transition-all duration-300", gameWon ? "opacity-80" : "opacity-100")}
            style={{
              gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
              maxWidth: `${boardSize * 4 + (boardSize - 1) * 0.5}rem`,
            }}
          >
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  onMouseEnter={() => !gameWon && setHoveredCell({ row: rowIndex, col: colIndex })}
                  onMouseLeave={() => setHoveredCell(null)}
                  disabled={gameWon}
                  className={cn(
                    "aspect-square rounded-lg flex items-center justify-center transition-all duration-300 transform",
                    cell
                      ? "bg-white text-indigo-950 shadow-[0_0_20px_rgba(255,255,255,0.8)]"
                      : "bg-slate-800/80 text-slate-500",
                    isNeighborCell(rowIndex, colIndex) &&
                      "border-2 border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.7)]",
                    gameWon ? "cursor-default" : "hover:scale-105",
                  )}
                >
                  <Lightbulb className={cn("transition-opacity", cell ? "opacity-100" : "opacity-40")} size={24} />
                </button>
              )),
            )}
          </div>
        </div>

        {gameWon && (
          <div className="text-center p-3 bg-white/10 rounded-lg text-white backdrop-blur-sm">
            <p className="font-bold">Puzzle solved in {moves} moves!</p>
            <p className="text-sm text-slate-300 mt-1">Click New Game to play again</p>
          </div>
        )}
      </div>

      <div className="text-white">
        <h2 className="text-white text-center text-xl font-bold mb-5">About LightsOut Game</h2>
        <p>
          <strong className="text-white">Goal:</strong> Turn off all the lights to win!
        </p>
        <p>
          <strong className="text-white">Rules:</strong>
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Click on a light to toggle it and its adjacent lights</li>
          <li>Adjacent means the lights directly above, below, left, and right</li>
          <li>Diagonal lights are not affected</li>
          <li>The game is won when all lights are turned off</li>
        </ul>
        <p>
          <strong className="text-white">Tips:</strong>
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Try to solve the puzzle in as few moves as possible</li>
          <li>Sometimes you need to turn on more lights to eventually turn them all off</li>
          <li>Larger board sizes create more complex puzzles</li>
        </ul>
      </div>

      <AlertDialog open={showSizeChangeDialog} onOpenChange={setShowSizeChangeDialog}>
        <AlertDialogContent className="bg-slate-800/95 border-slate-700 text-white backdrop-blur-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Change Board Size?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-300">
              Changing the board size will reset your current game progress. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-700 text-white hover:bg-slate-600 border-slate-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmSizeChange} className="bg-white text-slate-900 hover:bg-slate-200">
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}


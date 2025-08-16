'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

const PIECES = [
  [[1, 1, 1, 1]], // I
  [[1, 1], [1, 1]], // O
  [[1, 1, 1], [0, 1, 0]], // T
  [[1, 1, 1], [1, 0, 0]], // L
  [[1, 1, 1], [0, 0, 1]], // J
  [[1, 1, 0], [0, 1, 1]], // S
  [[0, 1, 1], [1, 1, 0]]  // Z
]

const COLORS = ['green', 'green', 'green', 'green', 'green', 'green', 'green']

interface Piece {
  shape: number[][]
  x: number
  y: number
  color: string
}

export default function TetrisPage() {
  const [board, setBoard] = useState<string[][]>(Array(20).fill(null).map(() => Array(10).fill('')))
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [lines, setLines] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [lastMoveTime, setLastMoveTime] = useState(0)

  const newPiece = useCallback((): Piece => {
    const randomIndex = Math.floor(Math.random() * PIECES.length)
    return {
      shape: PIECES[randomIndex],
      x: Math.floor(10 / 2) - Math.floor(PIECES[randomIndex][0].length / 2),
      y: 0,
      color: COLORS[randomIndex]
    }
  }, [])

  const canMove = useCallback((piece: Piece, dx: number, dy: number, newShape?: number[][]): boolean => {
    const shape = newShape || piece.shape
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const newX = piece.x + x + dx
          const newY = piece.y + y + dy
          if (newX < 0 || newX >= 10 || newY >= 20 || (newY >= 0 && board[newY][newX])) {
            return false
          }
        }
      }
    }
    return true
  }, [board])

  const rotatePiece = useCallback((piece: Piece): Piece => {
    const rotated = piece.shape[0].map((_, i) => piece.shape.map(row => row[i]).reverse())
    if (canMove(piece, 0, 0, rotated)) {
      return { ...piece, shape: rotated }
    }
    return piece
  }, [canMove])

  const placePiece = useCallback((piece: Piece) => {
    const newBoard = board.map(row => [...row])
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x] && piece.y + y >= 0) {
          newBoard[piece.y + y][piece.x + x] = piece.color
        }
      }
    }
    setBoard(newBoard)
    
    let linesCleared = 0
    for (let y = 19; y >= 0; y--) {
      if (newBoard[y].every(cell => cell)) {
        newBoard.splice(y, 1)
        newBoard.unshift(Array(10).fill(''))
        linesCleared++
        y++
      }
    }
    
    if (linesCleared > 0) {
      setLines(prev => prev + linesCleared)
      setScore(prev => prev + linesCleared * 100 * level)
      if (lines % 10 === 0) setLevel(prev => prev + 1)
    }
    
    if (!canMove(newPiece(), 0, 0)) {
      setGameOver(true)
    } else {
      setCurrentPiece(newPiece())
    }
  }, [board, canMove, newPiece, lines, level])

  const moveDown = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return
    
    if (canMove(currentPiece, 0, 1)) {
      setCurrentPiece(prev => prev ? { ...prev, y: prev.y + 1 } : null)
    } else {
      placePiece(currentPiece)
    }
  }, [currentPiece, canMove, placePiece, gameOver, isPaused])

  const moveLeft = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return
    
    if (canMove(currentPiece, -1, 0)) {
      setCurrentPiece(prev => prev ? { ...prev, x: prev.x - 1 } : null)
    }
  }, [currentPiece, canMove, gameOver, isPaused])

  const moveRight = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return
    
    if (canMove(currentPiece, 1, 0)) {
      setCurrentPiece(prev => prev ? { ...prev, x: prev.x + 1 } : null)
    }
  }, [currentPiece, canMove, gameOver, isPaused])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      e.preventDefault()
      
      if (gameOver) return
      
      const now = Date.now()
      if (now - lastMoveTime < 50) return // Debounce rapid key presses
      
      switch (e.key.toLowerCase()) {
        case 'arrowleft':
        case 'a':
        case 'h':
          moveLeft()
          setLastMoveTime(now)
          break
        case 'arrowright':
        case 'd':
        case 'l':
          moveRight()
          setLastMoveTime(now)
          break
        case 'arrowdown':
        case 's':
        case 'j':
          moveDown()
          setLastMoveTime(now)
          break
        case 'arrowup':
        case 'w':
        case 'k':
          if (currentPiece) {
            setCurrentPiece(rotatePiece(currentPiece))
            setLastMoveTime(now)
          }
          break
        case ' ':
          setIsPaused(prev => !prev)
          break
        case 'r':
          if (gameOver) {
            setBoard(Array(20).fill(null).map(() => Array(10).fill('')))
            setCurrentPiece(newPiece())
            setScore(0)
            setLevel(1)
            setLines(0)
            setGameOver(false)
            setIsPaused(false)
          }
          break
        case 'p':
          setIsPaused(prev => !prev)
          break
      }
    }

    const preventScroll = (e: KeyboardEvent) => {
      e.preventDefault()
    }

    window.addEventListener('keydown', handleKeyPress)
    window.addEventListener('keydown', preventScroll, { passive: false })
    

    const scrollKeys = ['PageUp', 'PageDown', 'Home', 'End', ' ']
    scrollKeys.forEach(key => {
      window.addEventListener('keydown', (e) => {
        if (e.key === key) {
          e.preventDefault()
        }
      }, { passive: false })
    })

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
      window.removeEventListener('keydown', preventScroll)
      scrollKeys.forEach(key => {
        window.removeEventListener('keydown', (e) => {
          if (e.key === key) {
            e.preventDefault()
          }
        })
      })
    }
  }, [currentPiece, moveLeft, moveRight, moveDown, rotatePiece, gameOver, newPiece, lastMoveTime])

  useEffect(() => {
    if (gameOver || isPaused) return
    
    const interval = setInterval(moveDown, Math.max(100, 1000 - level * 50))
    return () => clearInterval(interval)
  }, [moveDown, gameOver, isPaused, level])

  useEffect(() => {
    setCurrentPiece(newPiece())
  }, [newPiece])

  const renderBoard = () => {
    const displayBoard = board.map(row => [...row])
    
    if (currentPiece) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x] && currentPiece.y + y >= 0) {
            displayBoard[currentPiece.y + y][currentPiece.x + x] = currentPiece.color
          }
        }
      }
    }
    
    return displayBoard
  }

  return (
    <div className="min-h-screen bg-black font-mono overflow-hidden">
      <div className="px-4 py-2 border-b border-green-500/30">
        <div className="text-xs text-green-400 mb-2">
          <span className="text-green-500">root@founderbase:~$</span> <span className="text-gray-500">./tetris</span>
        </div>
        <div className="text-xs text-green-400">
          <span className="text-green-500">root@founderbase:~$</span> <span className="text-gray-500"># Game started</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl h-[calc(100vh-120px)] overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-green-400 mb-3">
            <span className="text-green-500">#</span> Oops! Not found. 
          </h1>
          <p className="text-sm text-gray-400">
            <span className="text-green-500">//</span> Maybe play tetris instead?
          </p>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="bg-gray-900 border border-green-500/30 rounded-lg p-2 text-center">
            <div className="text-xs text-gray-500 mb-1">SCORE</div>
            <div className="text-sm font-bold text-green-400">{score.toString().padStart(6, '0')}</div>
          </div>
          <div className="bg-gray-900 border border-green-500/30 rounded-lg p-2 text-center">
            <div className="text-xs text-gray-500 mb-1">LEVEL</div>
            <div className="text-sm font-bold text-green-400">{level}</div>
          </div>
          <div className="bg-gray-900 border border-green-500/30 rounded-lg p-2 text-center">
            <div className="text-xs text-gray-500 mb-1">LINES</div>
            <div className="text-sm font-bold text-green-400">{lines}</div>
          </div>
          <div className="bg-gray-900 border border-green-500/30 rounded-lg p-2 text-center">
            <div className="text-xs text-gray-500 mb-1">STATUS</div>
            <div className={`text-xs font-bold ${gameOver ? 'text-red-400' : isPaused ? 'text-yellow-400' : 'text-green-400'}`}>
              {gameOver ? 'GAME OVER' : isPaused ? 'PAUSED' : 'PLAYING'}
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-4">
          <div className="bg-gray-900 border-2 border-green-500/50 p-3 rounded-lg">
            <div className="grid grid-cols-10 gap-0.5">
              {renderBoard().map((row, y) =>
                row.map((cell, x) => (
                  <div
                    key={`${y}-${x}`}
                    className={`w-5 h-5 border border-gray-700 ${
                      cell ? 'bg-green-500' : 'bg-gray-800'
                    }`}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-green-500/30 rounded-lg p-4 mb-4">
          <div className="text-sm text-green-400 mb-3">
            <span className="text-green-500">$</span> Controls:
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-gray-400">
            <div><span className="text-green-500">←/A/H</span> Move Left</div>
            <div><span className="text-green-500">→/D/L</span> Move Right</div>
            <div><span className="text-green-500">↓/S/J</span> Move Down</div>
            <div><span className="text-green-500">↑/W/K</span> Rotate</div>
            <div><span className="text-green-500">Space/P</span> Pause</div>
            <div><span className="text-green-500">R</span> Restart</div>
          </div>
        </div>

        <div className="flex justify-center space-x-3">
          <Link 
            href="/" 
            className="bg-gray-900 border border-green-500/30 rounded-lg px-4 py-2 hover:border-green-400/50 transition-colors duration-300"
          >
            <span className="text-green-400 text-sm">
              <span className="text-green-500">$</span> cd /
            </span>
          </Link>
          <Link 
            href="/essays" 
            className="bg-gray-900 border border-green-500/30 rounded-lg px-4 py-2 hover:border-green-400/50 transition-colors duration-300"
          >
            <span className="text-green-400 text-sm">
              <span className="text-green-500">$</span> cd essays
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}

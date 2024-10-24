import React, { useState, useEffect } from "react";
import './App.css';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true); 
  const [gameOver, setGameOver] = useState(false);

  const handleClick = (index) => {
    if (board[index] || checkWinner(board) || gameOver) return;

    const newBoard = [...board];
    newBoard[index] = "🩵"; //joueur
    setBoard(newBoard);
    setIsXNext(false);
  };

  //  minimax pour choisir le meilleur coup pour l'ordinateur
  const minimax = (newBoard, depth, isMaximizing) => {
    const winner = checkWinner(newBoard);
    if (winner === "🩷") return 10 - depth; // victoire de l'ordi
    if (winner === "🩵") return depth - 10; // victoire du joueur
    if (newBoard.every((square) => square !== null)) return 0; // égalité

    if (isMaximizing) {
      let bestScore = -Infinity;
      newBoard.forEach((value, idx) => {
        if (!value) {
          newBoard[idx] = "🩷"; // ordi
          let score = minimax(newBoard, depth + 1, false);
          newBoard[idx] = null;
          bestScore = Math.max(score, bestScore);
        }
      });
      return bestScore;
    } else {
      let bestScore = Infinity;
      newBoard.forEach((value, idx) => {
        if (!value) {
          newBoard[idx] = "🩵"; // joueur
          let score = minimax(newBoard, depth + 1, true);
          newBoard[idx] = null;
          bestScore = Math.min(score, bestScore);
        }
      });
      return bestScore;
    }
  };

  const computerPlay = (newBoard) => {
    let bestMove;
    let bestScore = -Infinity;
    newBoard.forEach((value, idx) => {
      if (!value) {
        newBoard[idx] = "🩷"; // ordi
        let score = minimax(newBoard, 0, false);
        newBoard[idx] = null;
        if (score > bestScore) {
          bestScore = score;
          bestMove = idx;
        }
      }
    });
    if (bestMove !== undefined) {
      newBoard[bestMove] = "🩷";
      setBoard(newBoard);
      setIsXNext(true);
    }
  };

  const checkWinner = (squares) => {
    const combos = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (let [a, b, c] of combos) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  useEffect(() => {
    const winner = checkWinner(board);
    if (winner || board.every((square) => square !== null)) {
      setGameOver(true);
    } else if (!isXNext && !gameOver) {
      setTimeout(() => {
        computerPlay([...board]);
      }, 500); 
    }
  }, [isXNext, board, gameOver]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setGameOver(false);
  };

  const winner = checkWinner(board);
  const status = winner ? `Winner: ${winner}` : gameOver ? "Draw!" : `Next player: ${isXNext ? "🩵" : "🩷"}`;

  return (
    <div className="wrapper">
      <div className="container">
        <h1>Tic Tac Toe</h1>
        <h2>{status}</h2>
        <div className="board">
          {board.map((value, index) => (
            <button key={index} onClick={() => handleClick(index)} className="square">
              {value}
            </button>
          ))}
        </div>
        <button onClick={resetGame} className="resetButton">Reset</button>
      </div>
    </div>
  );
};

export default TicTacToe;

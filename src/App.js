import React, { useState } from 'react';

function Square({ value, onSquareClick, isWinning }) { // creates square component
  return (
    <button className={`square ${isWinning ? 'winning' : ''}`} onClick={onSquareClick}>
      {value} // X, O, null
    </button>
  ); // concatenates square with winning (if isWinning prop is true). This allows styling of the button based on whether it's part of a winning combination
}

function Board({ xIsNext, squares, onPlay }) { // creates Board component
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    // It first checks if there's already a winner (calculateWinner(squares)) or if the square is already filled
    // If either condition is true, it returns
    // If conditions are false, it calls onPlay, which updates the game state to place 'X' or 'O' (depending on xIsNext) in the clicked square
    const nextSquares = squares.slice(); // copy of a portion of an array into a new array object
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares); // indicates if there is a winner
  let status; // displays winner or turn
  let winningLine = null; // stores info if there is a winner

  if (winner) {
    status = 'Winner: ' + winner;
    winningLine = calculateWinningLine(squares); // Assigns the winning line if any from the winner object to winningLine
  } else {
    status = squares.every(square => square !== null) ? 'It\'s a draw!' : 'Next player: ' + (xIsNext ? 'X!' : 'O!');
  } // Sets status to "Next player: " followed by either 'X' or 'O', based on the xIsNext variable

  function calculateWinningLine(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) { // loop keeps going as long as i is less than the length of the lines array
      const [a, b, c] = lines[i]; // a,b,c = 0,1,2 which is the top row of the gameboard
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return lines[i]; // if a, b, and c are all the same return winning line 
      }
    }
    return null; // loop completes with no winning line
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board">
        {[0, 1, 2].map(row => ( // Maps over an array [0, 1, 2] to render rows of squares on the board
          <div key={row} className="board-row">
            {[0, 1, 2].map(col => { // Inside each row, maps over [0, 1, 2] to render columns
              const index = row * 3 + col; // Formula for the index in the linear array squares
              return (
                <Square
                  key={index} // Reacts unique key when listing components of game board
                  value={squares[index]} // value of the square based on squares array at index
                  onSquareClick={() => handleClick(index)} // callback function to handle click events on the square
                  isWinning={winningLine && winningLine.includes(index)} // If current square is part of the winning line. If winningLine exists and includes index, isWinning is set to true
                />
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true); // initiates whose turn it is, X=true, 0=false
  const [history, setHistory] = useState([Array(9).fill(null)]); // stores history of the game board states
  const [currentMove, setCurrentMove] = useState(0); // current move or step in game history
  const currentSquares = history[currentMove]; // current state of the game board 

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]; // spread operator that copies array up to index
    setHistory(nextHistory); history of board states is updated to reflect the player's latest move
    setCurrentMove(nextHistory.length - 1); most recent move game history
    setXIsNext(!xIsNext); logical NOT operator; flips the boolean value 
  }

  function jumpTo(nextMove) { // changes current position in history to specified move
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0); // even=x,odd=o; assumes that players alternate turns starting with x
  }

  const moves = history.map((squares, move) => { // array of JSX elements, one for each move in the game's history
    const description = move > 0 ? 'Go to move #' + move : 'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return ( // complete board component
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) { // Helper function
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

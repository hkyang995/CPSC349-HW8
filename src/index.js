import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
      style={{ backgroundColor: props.color }}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    let color = "white";
    if (this.props.winningpositions) {
      for (let y = 0; y < this.props.winningpositions.length; y++) {
        if (i === this.props.winningpositions[y]) {
          color = "red";
        }
      }
    }

    return (
      <Square
        color={color}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let items = [];
    let place = 0;
    for (let i = 0; i < this.props.boardsize; i++) {
      let inneritems = [];
      for (let y = i; y < this.props.boardsize + i; y++) {
        inneritems.push(<>{this.renderSquare(place)}</>);
        place++;
      }
      items.push(<div className="board-row">{inneritems}</div>);
    }
    return <div>{items}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      size: 0,
      historycoords: []
    };
  }

  handleClick(i) {
    let col = (i % this.state.size) + 1;
    let row = Math.floor(i / this.state.size) + 1;

    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const historycoords = this.state.historycoords.slice(
      0,
      this.state.stepNumber + 1
    );
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares, this.state.size) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      historycoords: historycoords.concat(row + "," + col),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      asc: true
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    let winner;
    let winningpositions;
    if (calculateWinner(current.squares, this.state.size)) {
      winner = calculateWinner(current.squares, this.state.size)[0];
      winningpositions = calculateWinner(current.squares, this.state.size)[1];
    }
    let moves;
    if (this.state.asc) {
      moves = history.map((step, move) => {
        const desc = move
          ? "Go to move #" +
            move +
            "(" +
            this.state.historycoords[move - 1] +
            ")"
          : "Go to game start";
        if (this.state.size === 0) {
          return <div key={move} />;
        }
        if (this.state.stepNumber === move) {
          return (
            <li key={move}>
              <button onClick={() => this.jumpTo(move)}>
                <b>{desc}</b>
              </button>
            </li>
          );
        }
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      });
    } else {
      moves = history.map((step, move) => {
        const reversed = history.length - move - 1;
        const desc = reversed
          ? "Go to move #" +
            reversed +
            "(" +
            this.state.historycoords[reversed - 1] +
            ")"
          : "Go to game start";
        if (this.state.size === 0) {
          return <div key={0} />;
        }
        if (this.state.stepNumber === reversed) {
          return (
            <li key={reversed}>
              <button onClick={() => this.jumpTo(reversed)}>
                <b>{desc}</b>
              </button>
            </li>
          );
        }
        return (
          <li key={reversed}>
            <button onClick={() => this.jumpTo(reversed)}>{desc}</button>
          </li>
        );
      });
    }

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      if (this.state.size === 0) {
        status = "Please choose a size.";
      } else {
        status = "Next player: " + (this.state.xIsNext ? "X" : "O");
      }
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            boardsize={this.state.size}
            winningpositions={winningpositions}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button
            style={{ display: this.state.size === 0 ? "none" : "block" }}
            onClick={() => this.setState({ asc: !this.state.asc })}
          >
            Toggle Ascending/Decending Order
          </button>
          <div style={{ display: this.state.size === 0 ? "block" : "none" }}>
            <button
              onClick={() => {
                this.setState({
                  size: 3
                });
              }}
            >
              3x3
            </button>
            <button
              onClick={() => {
                this.setState({ size: 4 });
              }}
            >
              4x4
            </button>
            <button
              onClick={() => {
                this.setState({ size: 5 });
              }}
            >
              5x5
            </button>
            <button
              onClick={() => {
                this.setState({ size: 6 });
              }}
            >
              6x6
            </button>
          </div>
          <ol>{moves}</ol>   
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares, size) {
  const lines = []; //generate winning grid

  let counter = 0;
  for (let i = 0; i < size; i++) {
    let inner = []; //side
    for (let y = 0; y < size; y++) {
      inner.push(counter);
      counter++;
    }
    lines.push(inner); //down

    inner = [];
    for (let y = i; y < size * size; y = y + size) {
      inner.push(y);
    }
    lines.push(inner);
  } //diagonals

  counter = 0;
  let counterback = size - 1;
  let inner = [];
  let innerback = [];
  for (let i = 0; i < size; i++) {
    inner.push(counter);
    innerback.push(counterback);
    counter += size + 1;
    counterback += size - 1;
  }
  lines.push(inner);
  lines.push(innerback);

  for (let i = 0; i < lines.length; i++) {
    if (size === 3) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return [squares[a], lines[i]];
      }
    } else if (size === 4) {
      const [a, b, c, d] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c] &&
        squares[a] === squares[d]
      ) {
        return [squares[a], lines[i]];
      }
    } else if (size === 5) {
      const [a, b, c, d, e] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c] &&
        squares[a] === squares[d] &&
        squares[a] === squares[e]
      ) {
        return [squares[a], lines[i]];
      }
    } else if (size === 6) {
      const [a, b, c, d, e, f] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c] &&
        squares[a] === squares[d] &&
        squares[a] === squares[e] &&
        squares[a] === squares[f]
      ) {
        return [squares[a], lines[i]];
      }
    }
  }

  if (size === 0) {
    return null;
  }

  for (let x = 0; x < squares.length; x++) {
    if (squares[x] === null) {
      return null;
    }
  }

  return ["Tie", []];
}

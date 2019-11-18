import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let boardsize = 5;
    let items = [];
    let place = 0;
    for (let i = 0; i < boardsize; i++) {
      let inneritems = [];
      for (let y = i; y < boardsize + i; y++) {
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
      xNext: true
    };
  }

  handleClick(i) {
    const history = this.state.history;
    console.log(history);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      xIsNext: !this.state.xIsNext
    });
  }

  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={i => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const size = 5;
  const lines = [];

  //generate winning grid
  let counter = 0;
  for (let i = 0; i < size; i++) {
    let inner = [];
    //side
    for (let y = 0; y < size; y++) {
      inner.push(counter);
      counter++;
    }
    lines.push(inner);

    //down
    inner = [];
    for (let y = i; y < size * size; y = y + size) {
      inner.push(y);
    }
    lines.push(inner);
  }

  //diagonals
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
    for (let y = 0; y < size; y++) {}
    const [a, b, c, d] = lines[i];
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c] &&
      squares[a] === squares[d]
    ) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

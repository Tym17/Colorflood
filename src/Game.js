import React from 'react';

class Game extends React.Component {
  constructor(props) {
    super(props);

    const colors = ['blue', 'red', 'green', 'yellow'];
    let randomSquares = Array(this.props.width * this.props.height).fill('white');
    randomSquares = randomSquares.map(x => colors[getRandomInt(0, 4)]);

    this.state = {
      history: [
        {
          squares: randomSquares,
        }
      ],
      selectedColor: randomSquares[0],
      step: 0,
    };

  }

  getCoords(x, y) {
    return y * this.props.width + x;
  }

  changeColor(col) {
    if (this.won()) {
      return;
    }

    const history = this.state.history.slice(0, this.state.step + 1);
    const current = this.state.history[this.state.step];
    const squares = current.squares.slice();
    const previousCol = squares[0];
    if (previousCol === col) {
      return;
    }

    const recurfill = (x, y) => {
      squares[this.getCoords(x, y)] = col;
      if (x - 1 >= 0 && x - 1 < this.props.width) { // left 
        if (squares[this.getCoords(x - 1, y)] === previousCol) {
          recurfill(x - 1, y);
        }
      }
      if (x + 1 >= 0 && x + 1 < this.props.width) { // right 
        if (squares[this.getCoords(x + 1, y)] === previousCol) {
          recurfill(x + 1, y);
        }
      }
      if (y - 1 >= 0 && y - 1 < this.props.height) { // top
        if (squares[this.getCoords(x, y - 1)] === previousCol) {
          recurfill(x, y - 1);
        }
      }
      if (y + 1 >= 0 && y + 1 < this.props.height) { // bottom
        if (squares[this.getCoords(x, y + 1)] === previousCol) {
          recurfill(x, y + 1);
        }
      }
    }
    recurfill(0, 0);

    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      selectedColor: col,
      step: this.state.step + 1,
    });
  }

  won() {
    const current = this.state.history[this.state.step];
    const squares = current.squares.slice();
    const dominatingCol = squares[0];

    for (const square of squares) {
      if (square !== dominatingCol) {
        return false;
      }
    }

    return true;
  }

  jumpTo(step) {
    const current = this.state.history[step].squares;

    this.setState({
      step: step,
      selectedColor: current[0],
    })
  }

  render() {
    let lines = [];
    const history = this.state.history;
    const current = history[this.state.step].squares;
    const status = this.won() ? 'Won with ' + this.state.step + ' steps' : 'Changes: ' + this.state.step;
    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    })

    for (let i = 0; i < this.props.width; i++) {
      lines = lines.concat([current.slice(i * this.props.width, (i + 1) * this.props.width)]);
    }

    let components = lines.map((line, index) => {
      return (
        <div key={index} className="game-row">
          {line.map((x, xi) => {
            return (<button
              key={index * this.props.width + xi}
              className={x + " square"} >
            </button>);
          })}
        </div>
      );
    });

    return (
      <div>
        <h1>ColorFlood</h1>
        <div className="game">
          <div className="board">
            {components}
          </div>
          <div className="menu">
            <div className={'selected-' + this.state.selectedColor + ' selected'} >Selected color</div>
            <div className="pickers">
              <button className="blue square pointer" onClick={() => this.changeColor('blue')}></button>
              <button className="red square pointer" onClick={() => this.changeColor('red')}></button>
              <button className="green square pointer" onClick={() => this.changeColor('green')}></button>
              <button className="yellow square pointer" onClick={() => this.changeColor('yellow')}></button>
            </div>
            <div className="status">{status}</div>
          </div>
          <div className="turns">
            <ol>
              {moves}
            </ol>
          </div>
        </div>
      </div>
    );
  }
}

export default Game;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
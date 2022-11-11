import { Component } from 'react';
import './bounceBall.css';

class BounceBall extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Football Animation'
    };
  }

  moveBall = () => {
    let start = Date.now();
    let football = document.querySelector(".circle")

    let timer = setInterval(function () {
      let interval = Date.now() - start;

      football.style.top = interval / 3 + 'px'; // move element down by 3px

      if (interval > 1000) clearInterval(timer); // stop animation

    }, 1000 / 60);
  }

  handleKeyDown = (event) => {
    console.log('User pressed: ', event.key);
  }

  render() {
    return (
      <div className="container" tabIndex={0} onKeyDown={this.handleKeyDown}>
        {/* <img className="circle" onClick={this.moveBall} onKeyPress={this.handleKeyPress} /> */}
        <img className="circle" />
      </div>
    );
  }

}

export default BounceBall
import "../styles/styles.css";
if (module.hot) {
  module.hot.accept();
}

import React from "react";
import ReactDOM from "react-dom";

class Counter extends React.Component {
  render() {
    var textStyle = {
      fontSize: 72,
      color: "#333",
      fontWeight: "700"
    };

    return <p style={textStyle}>{this.props.display}</p>;
  }
}

class CounterParent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 0
    };
  }

  // event handler = //
  increaseCounter(e) {
    let currentCount = this.state.count;

    if (e.shiftKey) {
      currentCount += 10;
    } else {
      currentCount += 1;
    }

    this.setState({
      count: currentCount
    });
  }

  render() {
    var backgroundStyle = {
      padding: "50px 20px",
      backgroundColor: "var(--color-brand-primary)",
      width: 250,
      borderRadius: 10,
      textAlign: "center",
      boxShadow: "0 5px 9px hsl(42, 50%, 50%, 0.35)"
    };

    return (
      <div style={backgroundStyle}>
        <h5>
          Hold Shift key and click on (+) button to increment the counter by
          ten!
        </h5>
        <Counter display={this.state.count} />
        <button
          className="c-button c-button--md c-button--primary"
          onClick={(e) => this.increaseCounter(e)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="16"
            width="16"
            fill="#fff"
            viewBox="0 0 512 512"
            fill-rule="evenodd"
            clip-rule="evenodd"
            shape-rendering="geometricPrecision"
            text-rendering="geometricPrecision"
            image-rendering="optimizeQuality"
          >
            <path d="M256 0c37 0 68 31 68 68v119h119c38 0 69 31 69 69 0 37-31 68-69 68H324v119c0 38-31 69-68 69-38 0-69-31-69-69V324H68c-37 0-68-31-68-68 0-38 31-69 68-69h119V68c0-37 31-68 69-68z" />
          </svg>
        </button>
      </div>
    );
  }
}

ReactDOM.render(<CounterParent />, document.querySelector("#root"));

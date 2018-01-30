import ReactDOM from 'react-dom';
import React from 'react';

function Root() {
  return (
    <div>Hello world!</div>
  );
}

ReactDOM.render(<Root />, document.querySelector('#root'));
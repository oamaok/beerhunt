import React from 'react';
import ReactDOM from 'react-dom';
import { actions } from 'redux-router5';

function BarListView() {
  	return <div className="bar-list-view"><BarSelector /></div>;
}

export default BarListView;

const bars = [
  {id: 0, name: 'bar 1'},
  {id: 1, name: 'bar 2'},
  {id: 2, name: 'bar 3'},
];

class BarSelector extends React.Component {

  barToLink = (bar) => {
    return (
      <li key={bar.id}>
        <a href="#" onClick={() => this.handleClick(bar.id)}>{bar.name}</a>
      </li>
    );
  }

  handleClick = (evt) => {
   	actions.navigateTo("/bar/:"+evt.toString());
  }

  render() {
	  return (
	    <div className="bar-selector">
	      <ul>    
	        {bars.map(this.barToLink)}
	      </ul>
	    </div>
	  )
  }
}
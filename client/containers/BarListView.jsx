import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
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

// function BarSelectList({ bars, navigateTo }) {

// 	function barToLink(bar) {
// 		return (
// 		  <li key={bar.id}>
// 		    <a href="#" onClick={() => navigateTo('bar', {barId: bar.id}) }>{bar.name}</a>
// 		  </li>
// 		);
// 	}

// 	return (
// 		<div className="bar-selector">
// 		  <ul>    
// 		    {bars.map(barToLink())}
// 		  </ul>
// 		</div>
// 	)
// }

// export default connect(
// 	bars,
// 	dispatch => bindActionCreators({ navigateTo: actions.navigateTo }, dispatch)
// )(BarSelectList)


class BarSelector extends React.Component {

  barToLink = (bar) => {
    return (
      <li key={bar.id}>
        <a href="#" onClick={() => this.handleClick(bar.id)}>{bar.name}</a>
      </li>
    );
  }

  handleClick = (evt) => {
   	// actions.navigateTo("/bar/:"+evt.toString());
	actions.navigateTo('bar', {barId: evt});
	console.log(actions.navigateTo('bar', {barId: evt}));
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
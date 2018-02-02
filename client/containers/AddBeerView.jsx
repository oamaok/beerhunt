import React from 'react';
import { createStore, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';

function AddBeerView() {
  return <div className="add-beer-view">
  		   <form>
  		     <SelectStyleComponent />
  		     <ABVComponent />
  		     <SelectSizeComponent />
  		     <button type="submit">Add Beer!</button>
  		   </form>
  		 </div>;
}

export default AddBeerView;

Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};

const beerTypes = [ // TODO: Get from db
  {id: 0, name: 'Lager'},
  {id: 1, name: 'IPA'},
  {id: 2, name: 'Ale'},
  {id: 3, name: 'Sour'},
  {id: 4, name: 'Stout'},
  {id: 5, name: 'Porter'},
  {id: 6, name: 'Wheat'},
  {id: 7, name: 'Lambic'},
];

const beerSizes = [ // TODO: Get from db
  "0.2",
  "0.3",
  "0.4",
  "0.5",
];

class SelectStyleComponent extends React.Component {

  state = {
    beer: 'initial'
  }

  handleStyleSelect = (evt) => {
    this.setState({
      beer: evt.target.value,
    });
    console.log(this.state.beer)
  }
  
  render() {
    return (
      <div>
        <select onChange={this.handleStyleSelect} value={this.state.beer}>
          <option value='initial' disabled> -- select beer style -- </option>
          {beerTypes.map(beer => <option value={beer.id}>{beer.name}</option>)}
        </select>
      </div>
    )
  }
}

function increaseAlc(amount) {
  return {
    type: 'INCREMENT',
    amount,
  };
}

function decreaseAlc(amount) {
  return {
    type: 'DECREMENT',
    amount,
  };
}

function alcReducer(state = { value: 0 }, action) {
  switch(action.type) {
    case 'INCREMENT':
      var amount = parseFloat((state.value + action.amount).toFixed(1))
      return {
      ...state,
      value: amount.clamp(0.0, 25.0),
      }
    case 'DECREMENT':
       var amount = parseFloat((state.value - action.amount).toFixed(1))
      return {
      ...state,
      value: amount.clamp(0.0, 25.0),
      }

    default:
      return state;
  }
}

const store = createStore(alcReducer);

function ABV(props) {
  return (
    <div>
      <div>Alcohol by volume: {props.storeState.value}</div>
      <div>
        <button onClick={() => props.decreaseAlc(0.1)}>Alc(-0.1%)</button>
        <button onClick={() => props.decreaseAlc(1.0)}>Alc(-1.0%)</button>
        <button onClick={() => props.increaseAlc(1.0)}>Alc(+1.0%)</button>
        <button onClick={() => props.increaseAlc(0.1)}>Alc(+0.1%)</button>
      </div>
    </div>
  );
}

const Connection = connect(
  state => ({ storeState: state }),
  { increaseAlc, decreaseAlc }
)(ABV);

class ABVComponent extends React.Component {
  render() {
    return (
    	<Provider store={store}>
    	  <Connection  />
  		</Provider>
  	)
  }
}

class SelectSizeComponent extends React.Component {

  state = {
    selectedSize: 'none'
  }

  handleChange = (evt) => {
  	this.state.selectedSize = evt.target.value
  	this.setState(
  	  {selectedSize: evt.target.value}
  	)
    console.log(this.state.selectedSize)
  }
  
  mapToInput = (size) => {
    return (
    	<label>
    	  <input type="radio" value={size} checked={this.state.selectedSize === size} 
    	onChange={this.handleChange} />
    	  {size.toString()+"l"}
    	</label>
    );
  }
  render() {
    return (
      <div>
        {beerSizes.map(this.mapToInput)}
      </div>
    )
  }
}
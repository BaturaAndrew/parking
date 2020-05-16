import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as PropTypes from 'prop-types';
import {Button} from 'antd';
import {addCarToParking} from './actions/carActions';
import './App.scss';
import {ModalAddNewCar} from './components/Modals/ModalAddNewCar';
import TableCars from './components/TableCars/TableCars';
import Filter from './components/Filter/Filter';
import {notification} from './helpers/notification';

class App extends Component {
  constructor() {
    super();
    this.state = {
      modalVisible: false,
      cars: [],
      filteredCars: [],
    };
  }

  // NOTE: here we change the array of cars
  onChangeCars = data => {
    this.setState(data);
  };

  setModalVisible = modalVisible => {
    this.setState({modalVisible});
  };

  addCarEntry = () => {
    const {dispatch} = this.props;
    const history = {
      time_in: '16:55:48',
      days: '15.05.2020',
      last_flag: false,
      car: 187,
    };

    dispatch(addCarToParking(history, notification));
    this.setModalVisible(false);
  };

  render() {
    const {cars, filteredCars} = this.state;

    return (
      <div>
        <div className="button-block flex-row">
          <Button
            type="primary"
            className="add-btn"
            onClick={() => this.setModalVisible(true)}>
            Добавить машину
          </Button>
          <Button type="primary" className="add-btn" onClick={this.addCarEntry}>
            Добавить машину на парковку
          </Button>
        </div>

        <Filter
          onChangeCars={this.onChangeCars}
          cars={cars}
          dispatch={this.props.dispatch}
        />

        <ModalAddNewCar
          setModalVisible={this.setModalVisible}
          modalVisible={this.state.modalVisible}
          dispatch={this.props.dispatch}
          cars={this.state.cars}
        />

        <TableCars
          cars={cars}
          filteredCars={filteredCars}
          onChangeCars={this.onChangeCars}
          dispatch={this.props.dispatch}
        />
      </div>
    );
  }
}

// FIXME: now it is for pass dispatch func from redux to Filter
export default connect()(App);
App.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

App.defaultProps = {};

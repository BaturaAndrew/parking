import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as PropTypes from 'prop-types';
import {Button} from 'antd';
import './App.scss';
import {ModalAddNewCar} from './components/Modals/ModalAddNewCar';
import {ModalAddNewParkedCar} from './components/Modals/ModalAddNewParkedCar';
import TableCars from './components/TableCars/TableCars';
import Filter from './components/Filter/Filter';
import {getAllBrands, getAllTenants} from './actions/carActions';

class App extends Component {
  constructor() {
    super();
    this.state = {
      modal1Visible: false,
      modal2Visible: false,
      cars: [],
      filteredCars: [],
    };
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(getAllBrands());
    dispatch(getAllTenants());
  }

  // NOTE: here we change the array of cars
  onChangeCars = data => {
    this.setState(data);
  };

  setModal1Visible = modal1Visible => {
    this.setState({modal1Visible});
  };

  setModal2Visible = modal2Visible => {
    this.setState({modal2Visible});
  };

  render() {
    const {cars, filteredCars} = this.state;
    const {tenants} = this.props;

    return (
      <div>
        <div className="button-block flex-row">
          <Button
            type="primary"
            className="add-btn"
            onClick={() => this.setModal1Visible(true)}>
            Добавить машину
          </Button>

          <Button
            type="primary"
            className="add-btn"
            onClick={() => this.setModal2Visible(true)}>
            Добавить машину на парковку
          </Button>
        </div>

        <Filter
          onChangeCars={this.onChangeCars}
          cars={cars}
          dispatch={this.props.dispatch}
          tenants={tenants}
        />

        <ModalAddNewCar
          setModalVisible={this.setModal1Visible}
          modalVisible={this.state.modal1Visible}
          dispatch={this.props.dispatch}
          cars={this.state.cars}
        />
        <ModalAddNewParkedCar
          setModalVisible={this.setModal2Visible}
          modalVisible={this.state.modal2Visible}
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

const mapStateToProps = store => ({
  brands: store.brands,
  tenants: store.tenants,
});

export default connect(mapStateToProps)(App);
App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  tenants: PropTypes.arrayOf(PropTypes.object),
};

App.defaultProps = {tenants: []};

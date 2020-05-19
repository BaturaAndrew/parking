import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import * as PropTypes from 'prop-types';
import {Button} from 'antd';
import './App.scss';
import {ModalAddNewCar} from './components/Modals/ModalAddNewCar';
import {ModalAddNewParkedCar} from './components/Modals/ModalAddNewParkedCar';
import {TableCars} from './components/TableCars/TableCars';
import Filter from './components/Filter/Filter';
import {getAllBrands, getAllTenants, getAllCars} from './actions/carActions';

const App = props => {
  const [modal1Visible, setModal1Visible] = useState(false);
  const [modal2Visible, setModal2Visible] = useState(false);
  const [filteredCars, setFilteredCars] = useState([]);
  const [filter, setFilter] = useState({name: ''});

  const {dispatch} = props;
  useEffect(() => {
    dispatch(getAllCars());
    dispatch(getAllBrands());
    dispatch(getAllTenants());
  }, [dispatch]);

  const onChangeFilteredCars = data => {
    setFilteredCars(data);
  };
  const onChangeFilter = data => {
    setFilter(data);
  };

  const {cars, idCarsOnTerritory, tenants, brands, isLoading} = props;

  return (
    <div>
      <div className="button-block flex-row">
        <Button
          type="primary"
          className="add-btn"
          onClick={() => setModal1Visible(true)}>
          Добавить машину
        </Button>

        <Button
          type="primary"
          className="add-btn"
          onClick={() => setModal2Visible(true)}>
          Добавить машину на парковку
        </Button>
      </div>

      <Filter
        onChangeFilteredCars={onChangeFilteredCars}
        onChangeFilter={onChangeFilter}
        cars={cars}
        dispatch={props.dispatch}
        tenants={tenants}
        idCarsOnTerritory={idCarsOnTerritory}
      />

      <ModalAddNewCar
        setModalVisible={setModal1Visible}
        modalVisible={modal1Visible}
        dispatch={props.dispatch}
        cars={cars}
        brands={brands}
        tenants={tenants}
      />
      <ModalAddNewParkedCar
        setModalVisible={setModal2Visible}
        modalVisible={modal2Visible}
        dispatch={props.dispatch}
        cars={cars}
      />

      <TableCars
        cars={cars}
        filter={filter}
        filteredCars={filteredCars}
        dispatch={props.dispatch}
        isLoading={isLoading}
      />
    </div>
  );
};

const mapStateToProps = store => ({
  idCarsOnTerritory: store.idCarsOnTerritory,
  cars: store.cars,
  isLoading: store.isCarLoading,
  brands: store.brands,
  tenants: store.tenants,
});

export default connect(mapStateToProps)(App);
App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  cars: PropTypes.arrayOf(PropTypes.object),
  tenants: PropTypes.arrayOf(PropTypes.object),
  brands: PropTypes.arrayOf(PropTypes.object),
  idCarsOnTerritory: PropTypes.arrayOf(PropTypes.number),
  isLoading: PropTypes.bool,
};

App.defaultProps = {
  cars: [],
  tenants: [],
  brands: [],
  isLoading: true,
  idCarsOnTerritory: [],
};

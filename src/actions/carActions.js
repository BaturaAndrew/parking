import axios from 'axios';
import {
  RECIEVE_ALL_CARS,
  RECIEVE_ALL_BRANDS,
  RECIEVE_ALL_TENANTS,
  RECIEVE_CARS_ON_TERRITORY,
  ADD_NEW_CAR,
  ADD_NEW_ENTRY,
  FAIL_ADDING_CAR,
} from '../constants/constants';

const receiveCars = cars => ({
  type: RECIEVE_ALL_CARS,
  cars,
  isCarLoading: false,
});
const receiveCarsOnTerritory = idCarsOnTerritory => ({
  type: RECIEVE_CARS_ON_TERRITORY,
  idCarsOnTerritory,
  isCarLoading: false,
});

const receiveBrands = brands => ({
  type: RECIEVE_ALL_BRANDS,
  brands,
  isCarLoading: false,
});

const receiveTenants = tenants => ({
  type: RECIEVE_ALL_TENANTS,
  tenants,
  isCarLoading: false,
});

const addNewCar = () => ({
  type: ADD_NEW_CAR,
  isCarAdded: true,
});

const addCarEntry = () => ({
  type: ADD_NEW_ENTRY,
  isCarEntryAdded: true,
});

const failAdded = error => ({
  type: FAIL_ADDING_CAR,
  error,
  isCarAdded: false,
});

const getAllBrands = () => dispatch => {
  axios.get('api/cars/brands/').then(res => dispatch(receiveBrands(res.data)));
};

const getAllTenants = () => dispatch => {
  axios.get('api/tenants/').then(res => dispatch(receiveTenants(res.data)));
};

const addCar = (car, cb) => dispatch => {
  axios({
    method: 'post',
    url: '/api/cars/add/',
    data: car,
  }).then(
    res => {
      dispatch(addNewCar(res.data));
      cb(res);
    },
    error => {
      dispatch(failAdded(error));
      cb(error);
    }
  );
};

const addCarToParking = (history, cb) => dispatch => {
  axios({
    method: 'post',
    url: '/api/stat/add/',
    data: history,
  }).then(
    res => {
      dispatch(addCarEntry(res.data));
      cb(res);
    },
    error => {
      dispatch(failAdded(error));
      cb(error);
    }
  );
};
export {
  receiveCars,
  receiveCarsOnTerritory,
  addCar,
  addCarToParking,
  getAllBrands,
  getAllTenants,
};

import axios from 'axios';
import {
  RECIEVE_ALL_CARS,
  ADD_NEW_CAR,
  ADD_NEW_ENTRY,
  FAIL_ADDING_CAR,
} from '../constants/constants';

const receiveCars = cars => ({
  type: RECIEVE_ALL_CARS,
  cars,
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

const getAllCars = () => dispatch => {
  axios.get('api/cars').then(res => dispatch(receiveCars(res.data)));
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
export {receiveCars, addNewCar, getAllCars, addCar, addCarToParking};

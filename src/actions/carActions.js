import axios from 'axios';
import {RECIEVE_ALL_CARS, ADD_NEW_CAR} from '../constants/constants';

const receiveCars = cars => ({
  type: RECIEVE_ALL_CARS,
  cars,
  isCarLoading: false,
});

const addNewCar = car => ({
  type: ADD_NEW_CAR,
});

const getAllCars = () => dispatch => {
  axios.get('api/cars').then(res => dispatch(receiveCars(res.data)));
};
export {receiveCars, addNewCar, getAllCars};

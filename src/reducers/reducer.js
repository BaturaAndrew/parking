import {RECIEVE_ALL_CARS, ADD_NEW_CAR} from '../constants/constants';

export default function cars(state = {}, action) {
  switch (action.type) {
    case RECIEVE_ALL_CARS: {
      return {
        ...state,
        cars: action.cars,
      };
    }
    default:
      return state;
  }
}

import {
  RECIEVE_ALL_CARS,
  RECIEVE_ALL_BRANDS,
  RECIEVE_ALL_TENANTS,
  ADD_NEW_CAR,
  ADD_NEW_ENTRY,
  FAIL_ADDING_CAR,
} from '../constants/constants';

export default function cars(state = {}, action) {
  switch (action.type) {
    case RECIEVE_ALL_CARS: {
      return {
        ...state,
        cars: action.cars,
      };
    }
    case RECIEVE_ALL_BRANDS: {
      return {
        ...state,
        brands: action.brands,
      };
    }
    case RECIEVE_ALL_TENANTS: {
      return {
        ...state,
        tenants: action.tenants,
      };
    }
    case ADD_NEW_CAR: {
      return {
        ...state,
        isCarAdded: action.isCarAdded,
      };
    }
    case ADD_NEW_ENTRY: {
      return {
        ...state,
        isCarEntryAdded: action.isCarEntryAdded,
      };
    }
    case FAIL_ADDING_CAR: {
      return {
        ...state,
        error: action.error,
        isCarAdded: action.isCarAdded,
      };
    }
    default:
      return state;
  }
}

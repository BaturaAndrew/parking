import _ from 'lodash';

export default class FilterCars {
  constructor(allCars, filter) {
    this.filterCars = allCars;
    this.filter = filter;
  }

  filterByObj() {
    if (this.filter.objFilter.car_tenant.name) {
      this.filterCars = _.filter(this.filterCars, this.filter.objFilter);
    }
    return this;
  }

  filterByCarNumber() {
    if (this.filter.car_number) {
      this.filterCars = this.filterCars.filter(car =>
        car.car_number.includes(this.filter.car_number)
      );
    }
    return this;
  }

  filterByCarId() {
    if (this.filter.id.length)
      this.filterCars = this.filterCars.filter(car =>
        this.filter.id.includes(car.id)
      );
    return this;
  }

  getFilteredCars() {
    return this.filterCars;
  }
}

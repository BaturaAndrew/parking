import React, {Component} from 'react';
import axios from 'axios';
import {Input, Collapse, Switch, Typography} from 'antd';
import * as PropTypes from 'prop-types';
import _ from 'lodash';
import {receiveCars} from '../../actions/carActions';

const {Panel} = Collapse;
const {Search} = Input;
const {Text} = Typography;

class Filter extends Component {
  constructor() {
    super();
    this.state = {
      filteredCars: [],
      filter: {
        car_tenant: {name: ''},
        id: [],
      },
    };
  }

  getCarsOnTerritory = () => {
    const {dispatch, onChangeCars} = this.props;
    axios.get('api/stat/here/').then(res => {
      const {data} = res;
      const idCarsOnTerritory = data.map(car => car.car);
      dispatch(receiveCars(data));
      this.setState(
        prevState => ({
          carsOnTerritory: data,
          filter: {...prevState.filter, id: idCarsOnTerritory},
        }),

        () => {
          this.filter();
          onChangeCars({
            filter: {carsOnTerritory: data, idCarsOnTerritory},
          });
        }
      );
    });
  };

  onSwitch = curState => {
    this.setState(prevState => ({
      ...prevState,
      switch: curState.switch,
    }));

    !this.state.switch
      ? this.getCarsOnTerritory()
      : this.setState(
          prevState => ({
            ...prevState,
            filter: {...prevState.filter, id: []},
            filteredCars: [],
          }),
          () => this.filter()
        );
  };

  onFilterEnter = (value, field) => {
    this.setState(
      prevState => ({
        ...prevState,
        filter: {...prevState.filter, car_tenant: {name: value}},
      }),
      () => this.filter()
    );
  };

  filter = () => {
    const {filter} = this.state;
    const {cars, onChangeCars} = this.props;
    const objFilter = {};
    let filterCars;

    // FIXME: Unallowed reassignment
    filter.car_tenant.name && (objFilter.car_tenant = filter.car_tenant);
    filterCars = _.filter(cars, objFilter);

    filter.id.length &&
      (filterCars = cars.filter(car => filter.id.includes(car.id)));

    this.setState(
      prevState => ({
        ...prevState,
        filteredCars: filterCars,
      }),
      onChangeCars({filteredCars: filterCars})
    );
  };

  render() {
    return (
      <Collapse defaultActiveKey={['0']}>
        <Panel header="Фильтр" key="1">
          <Search
            name="car_tenant"
            allowClear
            placeholder="Альфа-Банк ЗАО"
            key="car_tenant"
            onSearch={value => this.onFilterEnter(value, 'car_tenant')}
            style={{width: 350, margin: 5}}
          />
          <Text code>Автомобили на территории</Text>
          <Switch onChange={value => this.onSwitch({switch: value})} />
        </Panel>
      </Collapse>
    );
  }
}

export default Filter;
Filter.propTypes = {
  dispatch: PropTypes.func.isRequired,
  cars: PropTypes.arrayOf(PropTypes.object),
  onChangeCars: PropTypes.func.isRequired,
};

Filter.defaultProps = {
  cars: [],
};

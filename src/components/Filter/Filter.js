import React, {Component} from 'react';
import axios from 'axios';
import {Input, Collapse, Switch, Typography, Select} from 'antd';
import * as PropTypes from 'prop-types';
import _ from 'lodash';
import {receiveCars} from '../../actions/carActions';

const {Panel} = Collapse;
const {Search} = Input;
const {Text} = Typography;
const {Option} = Select;

class Filter extends Component {
  constructor() {
    super();
    this.state = {
      filteredCars: [],
      filter: {
        objFilter: {car_tenant: {name: ''}},
        car_number: '',
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
    const filt = fl => {
      if (fl === 'car_number') {
        return {car_number: value};
      }
      return {objFilter: {car_tenant: {name: value}}};
    };
    const filter = filt(field);

    this.setState(
      prevState => ({
        ...prevState,
        filter: {...prevState.filter, ...filter},
      }),
      () => this.filter()
    );
  };

  filter = () => {
    const {filter} = this.state;
    const {cars, onChangeCars} = this.props;

    const filt = fl => {
      if (filter.objFilter.car_tenant.name) {
        return _.filter(cars, filter.objFilter);
      }
      if (filter.car_number) {
        return cars.filter(car => car.car_number.includes(filter.car_number));
      }
      if (filter.id.length)
        return cars.filter(car => filter.id.includes(car.id));
      return cars;
    };

    const filterCars = filt(filter);

    this.setState(
      prevState => ({
        ...prevState,
        filteredCars: filterCars,
      }),
      onChangeCars({filteredCars: filterCars})
    );
  };

  render() {
    const {tenants} = this.props;
    const children = tenants.map(tenant => (
      <Option key={tenant.id} value={tenant.name}>
        {tenant.name}
      </Option>
    ));

    return (
      <Collapse defaultActiveKey={['0']}>
        <Panel header="Фильтр" key="1">
          <Select
            name="car_tenant"
            allowClear
            placeholder="Альфа-Банк ЗАО"
            onChange={value => this.onFilterEnter(value, 'car_tenant')}
            style={{width: 250, margin: 5}}>
            {children}
          </Select>
          ,
          <Search
            name="car_number"
            allowClear
            placeholder="3433 OO-5"
            key="car_number"
            onSearch={value => this.onFilterEnter(value, 'car_number')}
            style={{width: 250, margin: 5}}
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
  tenants: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Filter.defaultProps = {
  cars: [],
};

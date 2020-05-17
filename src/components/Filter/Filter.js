import React, {Component} from 'react';
import axios from 'axios';
import {Input, Collapse, Switch, Typography, Select} from 'antd';
import * as PropTypes from 'prop-types';
import {receiveCars} from '../../actions/carActions';
import FilterCars from '../../helpers/FilterCars';

const {Panel} = Collapse;
const {Text} = Typography;
const {Option} = Select;

class Filter extends Component {
  constructor() {
    super();
    this.state = {
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
          }),
          () => this.filter()
        );
  };

  onFilterEnter = (value, field) => {
    const chooseFilter = fld => {
      if (fld === 'car_number') {
        return {car_number: value};
      }
      return {objFilter: {car_tenant: {name: value}}};
    };
    const filter = chooseFilter(field);

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

    const filterCars = new FilterCars(cars, filter)
      .filterByObj()
      .filterByCarNumber()
      .filterByCarId()
      .getFilteredCars();

    this.setState(
      prevState => ({
        ...prevState,
      }),
      onChangeCars({
        filteredCars: filterCars,
        filter: filter.objFilter.car_tenant,
      })
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

          <Input
            name="car_number"
            allowClear
            placeholder="3433 OO-5"
            key="car_number"
            defaultValue={this.state.filter.car_number}
            onChange={e => this.onFilterEnter(e.target.value, 'car_number')}
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

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Input, Collapse, Switch, Typography, Select} from 'antd';
import * as PropTypes from 'prop-types';
import {getCarsOnTerritory} from '../../actions/carActions';
import FilterCars from '../../helpers/FilterCars';

const {Panel} = Collapse;
const {Text} = Typography;
const {Option} = Select;

class Filter extends Component {
  constructor() {
    super();
    this.idCarsOnTerritory = [];
    this.state = {
      filter: {
        objFilter: {car_tenant: {name: ''}},
        car_number: '',
        id: [],
      },
    };
  }

  shouldComponentUpdate(nextProps) {
    const {idCarsOnTerritory} = nextProps;
    if (nextProps.idCarsOnTerritory !== this.props.idCarsOnTerritory) {
      this.idCarsOnTerritory = idCarsOnTerritory;
      this.setState(
        prevState => ({
          filter: {...prevState.filter, id: idCarsOnTerritory},
        }),
        this.filter()
      );
    }
    return true;
  }

  loadCarsOnTerritory = () => {
    const {dispatch} = this.props;
    dispatch(getCarsOnTerritory());
  };

  onSwitch = curState => {
    this.setState(prevState => ({
      ...prevState,
      switch: curState.switch,
    }));

    !this.state.switch
      ? this.loadCarsOnTerritory()
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
    filter.id = this.idCarsOnTerritory;
    const filterCars = new FilterCars(cars, filter)
      .filterByObj()
      .filterByCarNumber()
      .filterByCarId()
      .getFilteredCars();

    this.setState(
      prevState => ({
        ...prevState,
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
          <Input
            name="car_number"
            allowClear
            placeholder="3433 OO-5"
            key="car_number"
            defaultValue={this.state.filter.car_number}
            onChange={e => this.onFilterEnter(e.target.value, 'car_number')}
            style={{width: 250, margin: 5}}
          />

          {/* // FIXME: this.state.filter.id is rendered but id isn't seen in this.filter
            this.state.filter.id{filter.id.map(el => (
            <div key={el}>{el}</div>
          ))} */}
          <Text code>Автомобили на территории</Text>
          <Switch onChange={value => this.onSwitch({switch: value})} />
        </Panel>
      </Collapse>
    );
  }
}
const mapStoreToProps = store => ({idCarsOnTerritory: store.idCarsOnTerritory});
export default connect(mapStoreToProps)(Filter);
Filter.propTypes = {
  dispatch: PropTypes.func.isRequired,
  cars: PropTypes.arrayOf(PropTypes.object),
  idCarsOnTerritory: PropTypes.arrayOf(PropTypes.number),
  onChangeCars: PropTypes.func.isRequired,
  tenants: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Filter.defaultProps = {
  cars: [],
  idCarsOnTerritory: [],
};

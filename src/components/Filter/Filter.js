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
    //  NOTE: or we can use UNSAFE_componentWillReceiveProps(nextProps) {
    const {idCarsOnTerritory} = nextProps;
    if (nextProps.idCarsOnTerritory !== this.props.idCarsOnTerritory) {
      this.setState(
        prevState => ({
          filter: {
            ...prevState.filter,
            id: idCarsOnTerritory,
          },
        })
        // NOTE: don't work
        // this.filter()
      );
    }
    return true;
  }

  componentDidUpdate() {
    // NOTE:   work
    this.filter();
  }

  loadCarsOnTerritory = () => {
    const {dispatch} = this.props;
    // NOTE: we invoke this.filter as a callback func
    dispatch(getCarsOnTerritory(this.filter));
  };

  onFilterSwitch = curState => {
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
    const {cars, onChangeFilteredCars} = this.props;
    const filterCars = new FilterCars(cars, filter)
      .filterByObj()
      .filterByCarNumber()
      .filterByCarId()
      .getFilteredCars();

    onChangeFilteredCars(filterCars);
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
          <Switch onChange={value => this.onFilterSwitch({switch: value})} />
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
  onChangeFilteredCars: PropTypes.func.isRequired,
  tenants: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Filter.defaultProps = {
  cars: [],
  idCarsOnTerritory: [],
};

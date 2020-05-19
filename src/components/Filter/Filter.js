import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import {Input, Collapse, Switch, Typography, Select} from 'antd';
import * as PropTypes from 'prop-types';
import {receiveCarsOnTerritory} from '../../actions/carActions';
import FilterCars from '../../helpers/FilterCars';

const {Panel} = Collapse;
const {Text} = Typography;
const {Option} = Select;

const Filter = props => {
  const {dispatch, cars, onChangeFilteredCars, onChangeFilter} = props;
  const [switcher, setSwitcher] = useState(false);

  useEffect(() => {
    if (switcher) {
      axios.get('api/stat/here/').then(res => {
        const {data} = res;
        const idCarsOnTerritory = data.map(car => car.car);
        dispatch(receiveCarsOnTerritory(idCarsOnTerritory));

        setFilter(prevState => ({
          ...prevState,
          id: idCarsOnTerritory,
        }));
      });
    } else {
      setFilter(prevState => ({
        ...prevState,
        id: [],
      }));
    }
  }, [switcher]);

  const [filter, setFilter] = useState({
    objFilter: {car_tenant: {name: ''}},
    car_number: '',
    id: [],
  });

  useEffect(() => {
    const filterCars = new FilterCars(cars, filter)
      .filterByObj()
      .filterByCarNumber()
      .filterByCarId()
      .getFilteredCars();

    onChangeFilteredCars(filterCars);
    onChangeFilter(filter.objFilter.car_tenant);
  }, [filter]);

  const onFilterEnter = (value, field) => {
    const chooseFilter = fld => {
      if (fld === 'car_number') {
        return {car_number: value};
      }
      return {objFilter: {car_tenant: {name: value}}};
    };
    const filt = chooseFilter(field);
    setFilter(prevState => ({
      ...prevState,
      ...filt,
    }));
  };

  const {tenants} = props;
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
          onChange={value => onFilterEnter(value, 'car_tenant')}
          style={{width: 250, margin: 5}}>
          {children}
        </Select>
        <Input
          name="car_number"
          allowClear
          placeholder="3433 OO-5"
          key="car_number"
          defaultValue={filter.car_number}
          onChange={e => onFilterEnter(e.target.value, 'car_number')}
          style={{width: 250, margin: 5}}
        />
        <Text code>Автомобили на территории</Text>
        <Switch onChange={value => setSwitcher(value)} />
      </Panel>
    </Collapse>
  );
};

const mapStoreToProps = store => ({idCarsOnTerritory: store.idCarsOnTerritory});
export default connect(mapStoreToProps)(Filter);
Filter.propTypes = {
  dispatch: PropTypes.func.isRequired,
  cars: PropTypes.arrayOf(PropTypes.object),
  onChangeFilteredCars: PropTypes.func.isRequired,
  onChangeFilter: PropTypes.func.isRequired,
  tenants: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Filter.defaultProps = {
  cars: [],
};

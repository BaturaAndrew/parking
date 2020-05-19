import React, {useEffect} from 'react';
import axios from 'axios';
import {Table, Tag, Spin} from 'antd';
import * as PropTypes from 'prop-types';
import {sort} from '../../helpers/sort';
import {receiveCars} from '../../actions/carActions';

const columns = [
  {
    title: 'Арендатор',
    dataIndex: 'car_tenant',
    key: 'car_tenant',
    sorter: (a, b) => sort(a, b, 'car_tenant'),
    render: text => (
      <div>
        {(text && `${text.name}`) || <Tag color="red">не заполнено</Tag>}
      </div>
    ),
  },
  {
    title: 'Номер',
    dataIndex: 'car_number',
    key: 'car_number',
    sorter: (a, b) => sort(a, b, 'car_number'),
    sortDirections: ['descend', 'ascend'],
  },

  {
    title: 'Бренд',
    dataIndex: 'car_brand',
    key: 'car_brand',
    render: brand => (
      <div>
        {(brand && `${brand.name}`) || <Tag color="red">не заполнено</Tag>}
      </div>
    ),
    sorter: (a, b) => sort(a, b, 'car_brand'),
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: 'Модель',
    dataIndex: 'car_model',
    key: 'car_model',
    render: model => (
      <div>
        {(model && `${model.name}`) || <Tag color="red">не заполнено</Tag>}
      </div>
    ),
    sorter: (a, b) => sort(a, b, 'car_model'),
    sortDirections: ['descend', 'ascend'],
  },
];

const TableCars = props => {
  const {dispatch, onChangeCars} = props;
  useEffect(() => {
    axios.get('api/cars').then(res => {
      const {data} = res;
      dispatch(receiveCars(data));
      // NOTE: use here, to get loaded data
      onChangeCars(data);
    });
  }, [dispatch, onChangeCars]);

  const {cars, filteredCars, filter, isLoading} = props;
  const data = filteredCars.length || filter.name !== '' ? filteredCars : cars;
  return (
    <div>
      {isLoading && <Spin className="loading flex-column" />}
      <Table
        size="small"
        scroll={{y: 530}}
        style={{border: '1px solid #d7d4d4'}}
        dataSource={data}
        columns={columns}
        rowKey={record => record.id}
        pagination={{
          pageSizeOptions: ['10', '25', '40', '50', '100'],
          showSizeChanger: true,
        }}
      />
    </div>
  );
};

export {TableCars};
TableCars.propTypes = {
  dispatch: PropTypes.func.isRequired,
  cars: PropTypes.arrayOf(PropTypes.object),
  filteredCars: PropTypes.arrayOf(PropTypes.object),
  filter: PropTypes.objectOf(PropTypes.string).isRequired,
  onChangeCars: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

TableCars.defaultProps = {cars: [], filteredCars: [], isLoading: true};

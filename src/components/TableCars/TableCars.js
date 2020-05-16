import React, {Component} from 'react';
import axios from 'axios';
import {Table, Tag} from 'antd';
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

class TableCars extends Component {
  constructor() {
    super();
    this.form = React.createRef();
    this.state = {};
  }

  componentDidMount() {
    this.getAllCars();
  }

  getAllCars = () => {
    const {dispatch, onChangeCars} = this.props;
    axios.get('api/cars').then(res => {
      const {data} = res;
      dispatch(receiveCars(data));
      onChangeCars({cars: data});
    });
  };

  render() {
    const {cars, filteredCars} = this.props;
    const data = filteredCars.length ? filteredCars : cars;
    return (
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
          pageSize: 10,
        }}
      />
    );
  }
}

export default TableCars;
TableCars.propTypes = {
  dispatch: PropTypes.func.isRequired,
  cars: PropTypes.arrayOf(PropTypes.object),
  filteredCars: PropTypes.arrayOf(PropTypes.object),
  onChangeCars: PropTypes.func.isRequired,
};

TableCars.defaultProps = {cars: [], filteredCars: []};

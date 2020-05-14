import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as PropTypes from 'prop-types';
import {Table, Tag} from 'antd';
import {getAllCars} from './actions/carActions';

const columns = [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
    width: 100,
  },
  {
    title: 'Бренд',
    dataIndex: 'car_brand',
    key: 'car_brand',
    render: brand => (
      <div>
        {(brand && `${brand.id} ${brand.name}`) || (
          <Tag color="red">не заполнено</Tag>
        )}
      </div>
    ),
  },
  {
    title: 'Модель',
    dataIndex: 'car_model',
    key: 'car_model',
    render: model => (
      <div>
        {(model && `${model.id} ${model.name}`) || (
          <Tag color="red">не заполнено</Tag>
        )}
      </div>
    ),
  },
  {
    title: 'Номер',
    dataIndex: 'car_number',
    key: 'car_number',
  },
  {
    title: 'Арендатор',
    dataIndex: 'car_tenant',
    key: 'car_tenant',
    render: tenant => (
      <div>
        {(tenant && `${tenant.id} ${tenant.name}`) || (
          <Tag color="red">не заполнено</Tag>
        )}
      </div>
    ),
  },
];
class App extends Component {
  componentDidMount() {
    this.loadData();
  }

  loadData() {
    const {dispatch} = this.props;
    dispatch(getAllCars());
  }

  render() {
    const {cars} = this.props;
    const total = cars ? cars.length : 0;
    return (
      <Table
        scroll={{y: 550}}
        style={{border: '1px solid #d7d4d4'}}
        dataSource={cars}
        columns={columns}
        rowKey={record => record.id}
        pagination={{
          pageSizeOptions: ['10', '25', '40', '50', '100'],
          showSizeChanger: true,
          showTotal: (count, range) =>
            `${range[0]}-${range[1]} из ${total} машин`,
          total,
        }}
      />
    );
  }
}

const mapStateToProps = store => ({cars: store.cars});

export default connect(mapStateToProps)(App);
App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  cars: PropTypes.arrayOf(PropTypes.object),
};

App.defaultProps = {
  cars: [],
};

import React, {Component} from 'react';
import axios from 'axios';
// eslint-disable-next-line no-unused-vars
import _ from 'lodash';
import {connect} from 'react-redux';
import * as PropTypes from 'prop-types';
import {
  Table,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  message,
  Collapse,
  Switch,
  Typography,
} from 'antd';
import {SendOutlined, ArrowLeftOutlined} from '@ant-design/icons';
import {receiveCars, addCar, addCarToParking} from './actions/carActions';
import './App.scss';
import {sort} from './helpers/sort';

const {Panel} = Collapse;
const {Search} = Input;
const {Text} = Typography;

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

class App extends Component {
  constructor() {
    super();
    this.form = React.createRef();
    this.state = {
      modalVisible: false,
      searchText: '',
      searchedColumn: '',
      filteredCars: [],
      filter: {
        car_tenant: {name: ''},
      },
    };
  }

  componentDidMount() {
    this.getAllCars();
  }

  onChange = curState => {
    this.setState(prevState => ({
      ...prevState,
      car: {...prevState.car, ...curState},
    }));
  };

  onSwitch = curState => {
    this.setState(prevState => ({
      ...prevState,
      switch: curState.switch,
    }));

    !this.state.switch ? this.getCarsOnTerritory() : this.getAllCars();
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

  setModalVisible(modalVisible) {
    this.setState({modalVisible});
  }

  filter = () => {
    const {filter, cars} = this.state;
    const objFilter = {};

    filter.car_tenant.name && (objFilter.car_tenant = filter.car_tenant);

    const filterCars = _.filter(cars, objFilter);

    this.setState(prevState => ({
      ...prevState,
      filteredCars: filterCars,
    }));
  };

  isValidForm = () => {
    const car = this.form.current.getFieldsValue();
    if (
      car.car_brand === undefined ||
      car.car_model === undefined ||
      car.car_tenant === undefined
    ) {
      return false;
    }
    return true;
  };

  addNewCar = () => {
    if (!this.isValidForm()) return;
    const {dispatch} = this.props;
    const {car} = this.state;
    const newCar = {
      car_number: car.car_number,
      car_brand: +car.car_brand,
      car_model: +car.car_model,
      car_tenant: +car.car_tenant,
    };

    dispatch(addCar(newCar, this.notification));
    this.setModalVisible(false);
  };

  addCarEntry = () => {
    const {dispatch} = this.props;
    const history = {
      time_in: '16:55:48',
      days: '15.05.2020',
      last_flag: false,
      car: 187,
    };

    dispatch(addCarToParking(history, this.notification));
    this.setModalVisible(false);
  };

  notification = status => {
    if (status.status === 200 || status.status === 201) {
      message.success(`${status.statusText}`);
    } else {
      message.error(`${status.message}`);
    }
  };

  getAllCars = () => {
    const {dispatch} = this.props;
    axios.get('api/cars').then(res => {
      const {data} = res;
      dispatch(receiveCars(data));
      this.setState({cars: data, filteredCars: data});
    });
  };

  getCarsOnTerritory = () => {
    const {dispatch} = this.props;
    axios.get('api/stat/here/').then(res => {
      const {data} = res;
      dispatch(receiveCars(data));
      this.setState({cars: data, filteredCars: data});
    });
  };

  render() {
    const {filteredCars} = this.state;

    return (
      <div>
        <Button type="primary" onClick={() => this.setModalVisible(true)}>
          Добавить машину
        </Button>
        <Button type="primary" onClick={this.addCarEntry}>
          Добавить машину на парковку
        </Button>
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
        <Modal
          title="Добавление машины"
          style={{top: 20}}
          visible={this.state.modalVisible}
          onOk={() => this.setModalVisible(false)}
          onCancel={() => this.setModalVisible(false)}
          okButtonProps={{style: {display: 'none'}}}
          cancelButtonProps={{style: {display: 'none'}}}>
          <Form ref={this.form} layout="vertical" name="nest-messages">
            <Form.Item
              name="car_number"
              label="Номер авто"
              rules={[
                {required: true, message: 'Пожалуйста, введите номер авто!'},
              ]}>
              <Input
                placeholder="AA 2099-7"
                onChange={e => this.onChange({car_number: e.target.value})}
              />
            </Form.Item>

            <Form.Item
              name="car_brand"
              label="Бренда авто (id)"
              rules={[
                {required: true, message: 'Пожалуйста, введите бренда авто!'},
              ]}>
              <Input
                placeholder="134 (ГАЗ)"
                onChange={e => this.onChange({car_brand: e.target.value})}
              />
            </Form.Item>
            <Form.Item
              name="car_model"
              label="Модель авто (id)"
              rules={[
                {required: true, message: 'Пожалуйста, введите модель авто!'},
              ]}>
              <Input
                placeholder="1878 (33023)"
                onChange={e => this.onChange({car_model: e.target.value})}
              />
            </Form.Item>
            <Form.Item
              name="car_tenant"
              label="Арендатор (id)"
              rules={[
                {required: true, message: 'Пожалуйста, введите арендатора!'},
              ]}>
              <Input
                placeholder="7 (Альфа-Банк ЗАО)"
                onChange={e => this.onChange({car_tenant: e.target.value})}
              />
            </Form.Item>

            <div className="button-block flex-row">
              <Form.Item>
                <Button
                  className="back-btn"
                  type="primary"
                  htmlType="button"
                  onClick={() => this.setModalVisible(false)}
                  icon={<ArrowLeftOutlined />}>
                  Закрыть форму
                </Button>
              </Form.Item>
              <Form.Item>
                <Button
                  className="send-btn"
                  type="primary"
                  htmlType="submit"
                  onClick={this.addNewCar}
                  icon={<SendOutlined />}>
                  Добавить
                </Button>
              </Form.Item>
            </div>
          </Form>
        </Modal>
        <Table
          size="small"
          scroll={{y: 530}}
          style={{border: '1px solid #d7d4d4'}}
          dataSource={filteredCars}
          columns={columns}
          rowKey={record => record.id}
          pagination={{
            pageSizeOptions: ['10', '25', '40', '50', '100'],
            showSizeChanger: true,
            pageSize: 100,
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = store => ({cars: store.cars});

export default connect(mapStateToProps)(App);
App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  // cars: PropTypes.arrayOf(PropTypes.object),
};

App.defaultProps = {
  // cars: [],
};

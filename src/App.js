import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as PropTypes from 'prop-types';
import {Table, Tag, Button, Modal, Form, Input, Space, message} from 'antd';
import {
  SendOutlined,
  SearchOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import {getAllCars, addCar, addCarToParking} from './actions/carActions';
import './App.scss';

class App extends Component {
  constructor() {
    super();
    this.form = React.createRef();
    this.state = {
      modalVisible: false,
      searchText: '',
      searchedColumn: '',
    };
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(getAllCars());
  }

  onChange = curState => {
    this.setState(prevState => ({
      ...prevState,
      car: {...prevState.car, ...curState},
    }));
  };

  setModalVisible(modalVisible) {
    this.setState({modalVisible});
  }

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

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({searchText: ''});
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

  render() {
    const columns = [
      {
        title: 'Бренд',
        dataIndex: 'car_brand',
        key: 'car_brand',
        render: brand => (
          <div>
            {(brand && `${brand.name}`) || <Tag color="red">не заполнено</Tag>}
          </div>
        ),
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
      },
      {
        title: 'Номер',
        dataIndex: 'car_number',
        key: 'car_number',
        sorter: (a, b) => a.car_number < b.car_number,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Арендатор',
        dataIndex: 'car_tenant',
        key: 'car_tenant',

        sorter: (a, b) => a.car_tenant.id - b.car_tenant.id,
        sortDirections: ['descend', 'ascend'],
        // FIXME: delete this filter
        filterDropdown: ({
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
        }) => (
          <div>
            <Input
              ref={node => {
                this.searchInput = node;
              }}
              placeholder={`Search ${'car_tenant'}`}
              value={selectedKeys[0]}
              onChange={e =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() =>
                this.handleSearch(selectedKeys, confirm, 'car_tenant')
              }
              style={{width: 188, marginBottom: 8, display: 'block'}}
            />
            <Space>
              <Button
                type="primary"
                onClick={() =>
                  this.handleSearch(selectedKeys, confirm, 'car_tenant')
                }
                icon={<SearchOutlined />}
                size="small"
                style={{width: 90}}>
                Search
              </Button>
              <Button
                onClick={() => this.handleReset(clearFilters)}
                size="small"
                style={{width: 90}}>
                Reset
              </Button>
            </Space>
          </div>
        ),

        filterIcon: filtered => (
          <SearchOutlined style={{color: filtered ? '#1890ff' : undefined}} />
        ),

        onFilter: (value, record) =>
          record.car_tenant.name.toString().includes(value),

        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => this.searchInput.select());
          }
        },
        render: text =>
          this.state.searchedColumn === 'car_tenant' ? (
            <Highlighter
              highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
              searchWords={[this.state.searchText]}
              autoEscape
              textToHighlight={text && `${text.name}`}
            />
          ) : (
            <div>
              {(text && `${text.name}`) || <Tag color="red">не заполнено</Tag>}
            </div>
          ),
      },
    ];
    const {cars} = this.props;
    return (
      <div>
        <Button type="primary" onClick={() => this.setModalVisible(true)}>
          Добавить машину
        </Button>
        <Button type="primary" onClick={this.addCarEntry}>
          Добавить машину на парковку
        </Button>
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
          scroll={{y: 570}}
          style={{border: '1px solid #d7d4d4'}}
          dataSource={cars}
          columns={columns}
          rowKey={record => record.id}
          pagination={{
            pageSizeOptions: ['10', '25', '40', '50', '100'],
            showSizeChanger: true,
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
  cars: PropTypes.arrayOf(PropTypes.object),
};

App.defaultProps = {
  cars: [],
};

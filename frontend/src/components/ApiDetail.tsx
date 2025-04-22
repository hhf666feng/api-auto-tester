import React from 'react';
import { Card, Table, Typography, Tag, Empty } from 'antd';
import { useApi } from '../context/ApiContext';

const { Title } = Typography;

const ApiDetail: React.FC = () => {
  const { selectedApi } = useApi();

  if (!selectedApi) {
    return (
      <div style={{ 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Empty description="请选择一个接口" />
      </div>
    );
  }

  const headerColumns = [
    {
      title: '参数名',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
    },
    {
      title: '参数值',
      dataIndex: 'value',
      key: 'value',
      width: '40%',
    },
    {
      title: '是否必填',
      dataIndex: 'required',
      key: 'required',
      width: '30%',
      render: (required: boolean) => (
        <Tag color={required ? '#52c41a' : '#d9d9d9'}>
          {required ? '是' : '否'}
        </Tag>
      )
    }
  ];

  const queryParamColumns = [
    {
      title: '参数名',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: '25%',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: '25%',
    },
    {
      title: '是否必填',
      dataIndex: 'required',
      key: 'required',
      width: '25%',
      render: (required: boolean) => (
        <Tag color={required ? '#d9d9d9' : '#d9d9d9'}>
          {required ? '是' : '否'}
        </Tag>
      )
    }
  ];

  const headers = [
    { name: 'Content-Type', value: 'application/json', required: true },
    { name: 'Authorization', value: 'Bearer token', required: true },
  ];

  const queryParams = [
    { name: 'page', type: 'number', description: '页码，默认1', required: false },
    { name: 'limit', type: 'number', description: '每页数量，默认20', required: false },
    { name: 'keyword', type: 'string', description: '搜索关键词', required: false },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
        <Title level={4} style={{ margin: 0 }}>获取用户列表</Title>
      </div>

      <div style={{ flex: 1, padding: '16px', overflow: 'auto', background: '#f5f5f5' }}>
        <div style={{ marginBottom: '16px', background: '#fff', padding: '16px', borderRadius: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Tag color="#87d068">GET</Tag>
            <Typography.Text code copyable>/api/v1/users</Typography.Text>
          </div>
        </div>

        <Card title="Headers" style={{ marginBottom: '16px' }} bordered={false}>
          <Table
            columns={headerColumns}
            dataSource={headers}
            pagination={false}
            size="small"
          />
        </Card>

        <Card title="Query Parameters" style={{ marginBottom: '16px' }} bordered={false}>
          <Table
            columns={queryParamColumns}
            dataSource={queryParams}
            pagination={false}
            size="small"
          />
        </Card>

        <Card title="Response" bordered={false}>
          <pre style={{ 
            margin: 0,
            padding: '16px',
            background: '#f5f5f5',
            borderRadius: '4px',
            fontSize: '14px'
          }}>
{`{
  "code": 200,
  "message": "success",
  "data": {
    "total": 100,
    "items": [
      {
        "id": 1,
        "name": "张伟",
        "email": "zhangwei@example.com",
        "phone": "13800138000",
        "created_at": "2024-01-20 10:00:00"
      },
      {
        "id": 2,
        "name": "李娜",
        "email": "lina@example.com",
        "phone": "13900139000",
        "created_at": "2024-01-20 10:01:00"
      }
    ]
  }
}`}
          </pre>
        </Card>
      </div>
    </div>
  );
};

export default ApiDetail; 
import React from 'react';
import { Card, Table, Typography } from 'antd';
import { ApiDetail as IApiDetail } from '../types';

const { Title } = Typography;

const mockApiDetail: IApiDetail = {
  id: '1',
  name: '获取用户列表',
  method: 'GET',
  path: '/api/v1/users',
  description: '获取系统中的用户列表，支持分页和搜索',
  parameters: [
    {
      name: 'page',
      type: 'number',
      description: '页码，默认1',
      required: false
    },
    {
      name: 'limit',
      type: 'number',
      description: '每页数量，默认20',
      required: false
    },
    {
      name: 'keyword',
      type: 'string',
      description: '搜索关键词',
      required: false
    }
  ],
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token'
  },
  response: {
    code: 200,
    message: 'success',
    data: {
      total: 100,
      items: []
    }
  }
};

const ApiDetail: React.FC = () => {
  const paramColumns = [
    {
      title: '参数名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '是否必填',
      dataIndex: 'required',
      key: 'required',
      render: (required: boolean) => required ? '是' : '否'
    }
  ];

  return (
    <div style={{ height: '100%', overflow: 'auto', padding: '16px' }}>
      <Card>
        <Title level={4}>{mockApiDetail.name}</Title>
        <div style={{ marginBottom: '16px' }}>
          <span
            style={{
              padding: '2px 6px',
              borderRadius: '4px',
              marginRight: '8px',
              fontSize: '12px',
              background: mockApiDetail.method === 'GET' ? '#87d068' : '#108ee9',
              color: '#fff'
            }}
          >
            {mockApiDetail.method}
          </span>
          <span>{mockApiDetail.path}</span>
        </div>
        <p>{mockApiDetail.description}</p>

        <Title level={5}>请求参数</Title>
        <Table
          columns={paramColumns}
          dataSource={mockApiDetail.parameters}
          pagination={false}
          size="small"
        />

        <Title level={5} style={{ marginTop: '16px' }}>Headers</Title>
        <Table
          columns={[
            {
              title: '参数名',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: '参数值',
              dataIndex: 'value',
              key: 'value',
            }
          ]}
          dataSource={Object.entries(mockApiDetail.headers).map(([name, value]) => ({
            key: name,
            name,
            value
          }))}
          pagination={false}
          size="small"
        />

        <Title level={5} style={{ marginTop: '16px' }}>响应示例</Title>
        <pre style={{ 
          background: '#f5f5f5',
          padding: '16px',
          borderRadius: '4px'
        }}>
          {JSON.stringify(mockApiDetail.response, null, 2)}
        </pre>
      </Card>
    </div>
  );
};

export default ApiDetail; 
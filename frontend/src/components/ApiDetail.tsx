import React from 'react';
import { Card, Table, Typography, Tag, Tabs, Empty, Descriptions } from 'antd';
import { useApi } from '../context/ApiContext';

const { Title } = Typography;
const { TabPane } = Tabs;

const methodColors = {
  'GET': '#87d068',
  'POST': '#108ee9',
  'PUT': '#f50',
  'DELETE': '#ff4d4f',
  'PATCH': '#faad14'
};

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

  const paramColumns = [
    {
      title: '参数名',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: '15%',
      render: (type: string) => <Tag>{type}</Tag>
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: '45%',
    },
    {
      title: '是否必填',
      dataIndex: 'required',
      key: 'required',
      width: '20%',
      render: (required: boolean) => (
        <Tag color={required ? '#f50' : '#87d068'}>
          {required ? '是' : '否'}
        </Tag>
      )
    }
  ];

  return (
    <div style={{ height: '100%', overflow: 'auto', padding: '16px' }}>
      <Card bordered={false}>
        <div style={{ marginBottom: '24px' }}>
          <Title level={4} style={{ marginBottom: '16px' }}>
            {selectedApi.name}
            <Tag 
              color={methodColors[selectedApi.method]} 
              style={{ marginLeft: '12px' }}
            >
              {selectedApi.method}
            </Tag>
          </Title>
          <Typography.Paragraph type="secondary">
            {selectedApi.description}
          </Typography.Paragraph>
          <Typography.Text code copyable>
            {selectedApi.path}
          </Typography.Text>
        </div>

        <Tabs defaultActiveKey="params">
          <TabPane tab="请求参数" key="params">
            <Table
              columns={paramColumns}
              dataSource={selectedApi.parameters}
              pagination={false}
              size="small"
              rowKey="name"
            />
          </TabPane>
          
          <TabPane tab="请求头" key="headers">
            <Descriptions bordered size="small" column={1}>
              {Object.entries(selectedApi.headers).map(([key, value]) => (
                <Descriptions.Item 
                  key={key} 
                  label={<Typography.Text code>{key}</Typography.Text>}
                >
                  {value}
                </Descriptions.Item>
              ))}
            </Descriptions>
          </TabPane>

          <TabPane tab="响应示例" key="response">
            <div style={{ 
              background: '#f5f5f5',
              padding: '16px',
              borderRadius: '4px',
              position: 'relative'
            }}>
              <Typography.Text code copyable style={{ position: 'absolute', right: '8px', top: '8px' }}>
                复制
              </Typography.Text>
              <pre style={{ margin: 0 }}>
                {JSON.stringify(selectedApi.response, null, 2)}
              </pre>
            </div>
          </TabPane>

          {selectedApi.status && (
            <TabPane tab="测试状态" key="status">
              <Descriptions bordered size="small">
                <Descriptions.Item label="测试状态">
                  <Tag color={
                    selectedApi.status === 'success' ? '#52c41a' : 
                    selectedApi.status === 'failed' ? '#ff4d4f' : 
                    '#d9d9d9'
                  }>
                    {selectedApi.status === 'success' ? '通过' : 
                     selectedApi.status === 'failed' ? '失败' : 
                     '未测试'}
                  </Tag>
                </Descriptions.Item>
                {selectedApi.lastTestedAt && (
                  <Descriptions.Item label="最后测试时间">
                    {selectedApi.lastTestedAt}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </TabPane>
          )}
        </Tabs>
      </Card>
    </div>
  );
};

export default ApiDetail; 
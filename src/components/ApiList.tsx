import React, { useState } from 'react';
import { Menu, Input, Tag, Tooltip, Badge } from 'antd';
import { SearchOutlined, FolderOutlined, ApiOutlined } from '@ant-design/icons';
import { ApiMethod } from '../types';
import { useApi } from '../context/ApiContext';

const { SubMenu } = Menu;

interface ApiItem {
  id: string;
  name: string;
  method: ApiMethod;
  path: string;
  description: string;
  parameters: Array<{
    name: string;
    type: string;
    description: string;
    required: boolean;
  }>;
  headers: Record<string, string>;
  response: {
    code: number;
    message: string;
    data: any;
  };
  status?: 'success' | 'failed' | 'not_tested';
  lastTestedAt?: string;
}

const mockApis: ApiItem[] = [
  {
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
    },
    status: 'success',
    lastTestedAt: '2024-02-20 15:30:00'
  },
  {
    id: '2',
    name: '创建新用户',
    method: 'POST',
    path: '/api/v1/users',
    description: '创建一个新的用户账号',
    parameters: [
      {
        name: 'username',
        type: 'string',
        description: '用户名',
        required: true
      },
      {
        name: 'email',
        type: 'string',
        description: '邮箱地址',
        required: true
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
        id: 1,
        username: 'test',
        email: 'test@example.com'
      }
    },
    status: 'not_tested'
  }
];

const methodColors: Record<ApiMethod, string> = {
  'GET': '#87d068',
  'POST': '#108ee9',
  'PUT': '#f50',
  'DELETE': '#ff4d4f',
  'PATCH': '#faad14'
};

const statusColors: Record<string, string> = {
  'success': '#52c41a',
  'failed': '#ff4d4f',
  'not_tested': '#d9d9d9'
};

const ApiList: React.FC = () => {
  const { setSelectedApi } = useApi();
  const [searchText, setSearchText] = useState('');

  const filteredApis = mockApis.filter(api => 
    api.name.toLowerCase().includes(searchText.toLowerCase()) ||
    api.path.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleApiSelect = (api: ApiItem) => {
    setSelectedApi(api);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px' }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="搜索接口"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          allowClear
        />
      </div>
      <Menu
        mode="inline"
        style={{ flex: 1, overflow: 'auto' }}
      >
        <SubMenu 
          key="user" 
          title={
            <span>
              <FolderOutlined />
              <span>用户管理模块</span>
              <Badge 
                count={filteredApis.length} 
                style={{ 
                  marginLeft: '8px',
                  backgroundColor: '#52c41a'
                }} 
              />
            </span>
          }
        >
          {filteredApis.map(api => (
            <Menu.Item
              key={api.id}
              onClick={() => handleApiSelect(api)}
              icon={<ApiOutlined />}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Tag color={methodColors[api.method]} style={{ marginRight: '8px' }}>
                    {api.method}
                  </Tag>
                  <Tooltip title={api.path}>
                    <span style={{ 
                      maxWidth: '150px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {api.name}
                    </span>
                  </Tooltip>
                </div>
                {api.status && (
                  <Badge 
                    status={api.status === 'success' ? 'success' : api.status === 'failed' ? 'error' : 'default'}
                    text={api.status === 'success' ? '通过' : api.status === 'failed' ? '失败' : '未测试'}
                  />
                )}
              </div>
            </Menu.Item>
          ))}
        </SubMenu>
      </Menu>
    </div>
  );
};

export default ApiList; 
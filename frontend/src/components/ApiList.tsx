import React, { useState } from 'react';
import { Menu, Input, Tag } from 'antd';
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
    }
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
    }
  }
];

const methodColors: Record<ApiMethod, string> = {
  'GET': '#87d068',
  'POST': '#108ee9',
  'PUT': '#f50',
  'DELETE': '#ff4d4f',
  'PATCH': '#faad14'
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
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
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
        style={{ flex: 1, overflow: 'auto', border: 'none' }}
        defaultOpenKeys={['user']}
        defaultSelectedKeys={['1']}
      >
        <SubMenu 
          key="user" 
          title={
            <span>
              <FolderOutlined />
              <span>用户管理模块</span>
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
                gap: '8px'
              }}>
                <Tag color={methodColors[api.method]}>
                  {api.method}
                </Tag>
                <span>{api.name}</span>
              </div>
            </Menu.Item>
          ))}
        </SubMenu>
      </Menu>
    </div>
  );
};

export default ApiList; 
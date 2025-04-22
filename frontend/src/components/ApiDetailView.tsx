import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Typography, Input, Tooltip, Select } from 'antd';
import { ApiDetail } from '../types';
import { 
  PlayCircleOutlined, 
  UndoOutlined, 
  RedoOutlined,
  SaveOutlined, 
  MessageOutlined, 
  SettingOutlined,
  MenuOutlined
} from '@ant-design/icons';
import Editor from "@monaco-editor/react";

const { Text } = Typography;

interface Props {
  api: ApiDetail;
  onApiUpdate?: (updatedApi: ApiDetail) => void;
  onRunTest?: () => void;
}

// Mock 数据
const mockResponse = {
  code: 200,
  message: "success",
  data: {
    total: 100,
    items: [
      {
        id: 1,
        name: "张伟",
        email: "zhangwei@example.com",
        phone: "13800138000",
        created_at: "2024-01-20 10:00:00"
      },
      {
        id: 2,
        name: "李明",
        email: "liming@example.com",
        phone: "13900139000",
        created_at: "2024-01-20 09:00:00"
      }
    ]
  }
};

const mockTestCode = `import requests
import json
import pytest
from concurrent.futures import ThreadPoolExecutor
import time

class TestUserAPI:
    BASE_URL = "http://api.example.com/v1/users"
    def setup_method(self):
        self.headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer your-token-here"
        }
    
    # 正常路径测试
    def test_get_users_success(self):
        params = {"page": 1, "limit": 20}
        response = requests.get(self.BASE_URL, headers=self.headers, params=params)
        assert response.status_code == 200
        data = response.json()
        assert data["code"] == 200
        assert data["data"]["total"] > 0
        assert len(data["data"]["items"]) > 0`;

const mockTestResult = `=== 测试开始 ===
时间: 2024-01-20 15:30:00
发送请求: GET http://api.example.com/v1/users
状态码: 200
响应时间: 156ms
响应数据:
{
    "code": 200,
    "message": "success",
    "data": {
        "total": 100,
        "items": [...]
    }
}`;

export const ApiDetailView: React.FC<Props> = ({ api, onApiUpdate, onRunTest }) => {
  const [testCode, setTestCode] = useState(mockTestCode);

  // Headers 表格配置
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
      width: '50%',
    },
    {
      title: '是否必填',
      dataIndex: 'required',
      key: 'required',
      width: '20%',
      render: (required: boolean) => (
        <Tag color={required ? "green" : "default"}>
          {required ? "是" : "否"}
        </Tag>
      ),
    },
  ];

  const headerData = [
    {
      key: '1',
      name: 'Content-Type',
      value: 'application/json',
      required: true,
    },
    {
      key: '2',
      name: 'Authorization',
      value: 'Bearer token',
      required: true,
    },
  ];

  // Query Parameters 表格配置
  const queryParamColumns = [
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
        <Tag color={required ? "否" : "default"}>
          {required ? "是" : "否"}
        </Tag>
      ),
    },
  ];

  const queryParamData = [
    {
      key: '1',
      name: 'page',
      type: 'number',
      description: '页码，默认1',
      required: false,
    },
    {
      key: '2',
      name: 'limit',
      type: 'number',
      description: '每页数量，默认20',
      required: false,
    },
    {
      key: '3',
      name: 'keyword',
      type: 'string',
      description: '搜索关键词',
      required: false,
    },
  ];

  return (
    <div style={{ display: 'flex', height: '100%', gap: '16px', padding: '16px', background: '#f5f5f5' }}>
      {/* 左侧接口信息 */}
      <div style={{ width: '45%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Card title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Tag color="blue">GET</Tag>
            <Text>获取用户列表</Text>
          </div>
        }>
          <Text type="secondary">/api/v1/users</Text>
          <div style={{ marginTop: '16px' }}>
            <Text>根据用户ID获取用户详细信息</Text>
          </div>
        </Card>

        <Card title="Headers" size="small">
          <Table
            columns={headerColumns}
            dataSource={headerData}
            pagination={false}
            size="small"
          />
        </Card>

        <Card title="Query Parameters" size="small">
          <Table
            columns={queryParamColumns}
            dataSource={queryParamData}
            pagination={false}
            size="small"
          />
        </Card>

        <Card title="Response" size="small">
          <Editor
            height="200px"
            defaultLanguage="json"
            value={JSON.stringify(mockResponse, null, 2)}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 12,
              lineNumbers: 'off',
            }}
          />
        </Card>
      </div>

      {/* 右侧测试区域 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '12px 16px', borderRadius: '8px' }}>
          <Space>
            <Select defaultValue="正常路径测试" style={{ width: 200 }}>
              <Select.Option value="正常路径测试">正常路径测试</Select.Option>
              <Select.Option value="异常路径测试">异常路径测试</Select.Option>
              <Select.Option value="边界值测试">边界值测试</Select.Option>
            </Select>
            <Tooltip title="撤销">
              <Button icon={<UndoOutlined />} />
            </Tooltip>
            <Tooltip title="重做">
              <Button icon={<RedoOutlined />} />
            </Tooltip>
            <Tooltip title="更多操作">
              <Button icon={<MenuOutlined />} />
            </Tooltip>
          </Space>
          <Space>
            <Button icon={<SaveOutlined />}>保存</Button>
            <Button type="primary" icon={<PlayCircleOutlined />} onClick={onRunTest}>
              运行测试
            </Button>
          </Space>
        </div>

        <Card style={{ flex: 1 }} bodyStyle={{ height: 'calc(100% - 48px)', padding: 0 }}>
          <Editor
            height="100%"
            defaultLanguage="python"
            value={testCode}
            onChange={(value) => setTestCode(value || '')}
            options={{
              minimap: { enabled: true },
              fontSize: 14,
              lineNumbers: 'on',
              renderWhitespace: 'all',
              formatOnPaste: true,
              formatOnType: true,
            }}
          />
        </Card>

        <Card 
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Text>测试结果</Text>
              <Tag color="success">测试通过</Tag>
            </div>
          }
          extra={
            <Space>
              <Button type="text" icon={<MessageOutlined />}>评论</Button>
              <Button type="text" icon={<SettingOutlined />}>设置</Button>
            </Space>
          }
        >
          <div style={{ 
            background: '#1e1e1e', 
            color: '#fff', 
            padding: '12px', 
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '12px',
            whiteSpace: 'pre-wrap'
          }}>
            {mockTestResult}
          </div>
        </Card>
      </div>
    </div>
  );
}; 
import React from 'react';
import { Layout, Menu, Button, Space } from 'antd';
import { PlusOutlined, SettingOutlined, FileTextOutlined, ApiOutlined } from '@ant-design/icons';
import SplitPane from 'react-split-pane';
import ApiList from './components/ApiList';
import ApiDetail from './components/ApiDetail';
import TestCaseEditor from './components/TestCaseEditor';
import { ApiProvider } from './context/ApiContext';
import './App.css';

const { Header } = Layout;

const App: React.FC = () => {
  return (
    <ApiProvider>
      <Layout style={{ height: '100vh' }}>
        <Header style={{ 
          display: 'flex', 
          alignItems: 'center', 
          padding: '0 24px',
          background: '#fff',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            flex: 1 
          }}>
            <ApiOutlined style={{ fontSize: '24px', marginRight: '8px' }} />
            <h1 style={{ margin: 0, marginRight: '48px' }}>API 自动化测试平台</h1>
            <Menu 
              mode="horizontal" 
              defaultSelectedKeys={['apis']}
              style={{ flex: 1, border: 'none' }}
            >
              <Menu.Item key="apis" icon={<ApiOutlined />}>
                接口管理
              </Menu.Item>
              <Menu.Item key="reports" icon={<FileTextOutlined />}>
                测试报告
              </Menu.Item>
              <Menu.Item key="settings" icon={<SettingOutlined />}>
                系统设置
              </Menu.Item>
            </Menu>
          </div>
          <Space>
            <Button type="primary" icon={<PlusOutlined />}>
              新建接口
            </Button>
          </Space>
        </Header>
        <Layout>
          <div style={{ height: 'calc(100vh - 64px)', position: 'relative' }}>
            <SplitPane
              split="vertical"
              minSize={200}
              defaultSize={300}
              primary="first"
              pane1Style={{ overflow: 'auto' }}
              pane2Style={{ overflow: 'auto' }}
            >
              <ApiList />
              <SplitPane
                split="vertical"
                minSize={300}
                defaultSize="50%"
                primary="first"
                pane1Style={{ overflow: 'auto' }}
                pane2Style={{ overflow: 'auto' }}
              >
                <ApiDetail />
                <TestCaseEditor />
              </SplitPane>
            </SplitPane>
          </div>
        </Layout>
      </Layout>
    </ApiProvider>
  );
};

export default App; 
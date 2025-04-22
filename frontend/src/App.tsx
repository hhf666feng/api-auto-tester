import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { PlusOutlined, SettingOutlined, FileTextOutlined, ApiOutlined, UserOutlined } from '@ant-design/icons';
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
          borderBottom: '1px solid #f0f0f0',
          height: '48px',
          lineHeight: '48px'
        }}>
          <Menu 
            mode="horizontal" 
            defaultSelectedKeys={['apis']}
            style={{ flex: 1, border: 'none' }}
          >
            <Menu.Item key="apis" icon={<ApiOutlined />}>
              接口用例
            </Menu.Item>
            <Menu.Item key="users" icon={<UserOutlined />}>
              场景用例
            </Menu.Item>
            <Menu.Item key="reports" icon={<FileTextOutlined />}>
              测试报告
            </Menu.Item>
            <Menu.Item key="settings" icon={<SettingOutlined />}>
              系统设置
            </Menu.Item>
          </Menu>
          <Button type="primary" icon={<PlusOutlined />}>
            新建接口
          </Button>
        </Header>
        <Layout>
          <div style={{ height: 'calc(100vh - 48px)', position: 'relative' }}>
            <SplitPane
              split="vertical"
              minSize={200}
              defaultSize={250}
              primary="first"
              pane1Style={{ overflow: 'auto' }}
              pane2Style={{ overflow: 'auto' }}
            >
              <ApiList />
              <SplitPane
                split="vertical"
                minSize={300}
                defaultSize="60%"
                primary="first"
                pane1Style={{ overflow: 'auto' }}
                pane2Style={{ overflow: 'auto', background: '#1e1e1e' }}
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
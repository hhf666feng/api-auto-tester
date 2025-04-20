import React from 'react';
import { Layout } from 'antd';
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
          padding: '0 20px',
          background: '#fff',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <h1 style={{ margin: 0 }}>API 自动化测试平台</h1>
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
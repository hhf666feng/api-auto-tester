import React, { useEffect } from 'react';
import { Button, Space, message } from 'antd';
import { PlayCircleOutlined, SaveOutlined } from '@ant-design/icons';
import Editor from '@monaco-editor/react';
import { useApi } from '../context/ApiContext';

const generateTestCase = (apiDetail: any) => {
  if (!apiDetail) return '';
  
  const params = apiDetail.parameters.reduce((acc: any, param: any) => {
    acc[param.name] = param.type === 'number' ? 1 : '';
    return acc;
  }, {});

  return `import requests
import json

def test_${apiDetail.path.replace(/\//g, '_').slice(1)}():
    url = "http://api.example.com${apiDetail.path}"
    headers = ${JSON.stringify(apiDetail.headers, null, 8)}
    ${apiDetail.method === 'GET' ? `params = ${JSON.stringify(params, null, 8)}` : 
      `data = ${JSON.stringify(params, null, 8)}`}

    response = requests.${apiDetail.method.toLowerCase()}(
        url,
        headers=headers,
        ${apiDetail.method === 'GET' ? 'params=params' : 'json=data'}
    )
    assert response.status_code == ${apiDetail.response.code}

    data = response.json()
    assert data["code"] == ${apiDetail.response.code}
    ${Object.keys(apiDetail.response.data).map(key => 
      `assert "${key}" in data["data"]`
    ).join('\n    ')}
`;
};

const TestCaseEditor: React.FC = () => {
  const { selectedApi, testCase, setTestCase } = useApi();

  useEffect(() => {
    if (selectedApi) {
      const newTestCase = generateTestCase(selectedApi);
      setTestCase(newTestCase);
    }
  }, [selectedApi, setTestCase]);

  const handleRunTest = async () => {
    try {
      // TODO: 实现实际的测试执行逻辑
      message.loading('正在执行测试...', 1);
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('测试执行成功！');
    } catch (error) {
      message.error('测试执行失败！');
    }
  };

  const handleSave = () => {
    // TODO: 实现保存测试用例的逻辑
    message.success('测试用例已保存！');
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ 
        padding: '8px 16px',
        borderBottom: '1px solid #f0f0f0',
        background: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ margin: 0 }}>测试用例编辑器</h3>
        <Space>
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={handleRunTest}
            disabled={!selectedApi}
          >
            运行测试
          </Button>
          <Button
            icon={<SaveOutlined />}
            onClick={handleSave}
            disabled={!selectedApi}
          >
            保存
          </Button>
        </Space>
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <Editor
          height="100%"
          defaultLanguage="python"
          value={testCase}
          onChange={(value) => setTestCase(value || '')}
          theme="vs-light"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            readOnly: !selectedApi
          }}
        />
      </div>
    </div>
  );
};

export default TestCaseEditor; 
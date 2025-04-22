import React, { useState, useEffect } from 'react';
import { Select, Button, Space, message } from 'antd';
import { PlayCircleOutlined, SaveOutlined, CodeOutlined } from '@ant-design/icons';
import Editor from '@monaco-editor/react';
import { useApi } from '../context/ApiContext';

interface TestScenario {
  key: string;
  name: string;
  description: string;
  template: string;
}

const TEST_SCENARIOS: TestScenario[] = [
  {
    key: 'normal',
    name: '正常路径测试',
    description: '验证API在正常输入下的行为',
    template: `import requests
import pytest

def test_normal_path():
    """测试正常路径场景"""
    response = requests.get(
        "http://api.example.com/v1/users",
        headers={
            "Content-Type": "application/json",
            "Authorization": "Bearer your-token"
        },
        params={
            "page": 1,
            "limit": 20
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["code"] == 200
    assert "total" in data["data"]
    assert "items" in data["data"]`
  },
  {
    key: 'error',
    name: '异常路径测试',
    description: '验证API在错误输入下的错误处理',
    template: `import requests
import pytest

def test_error_path():
    """测试异常路径场景"""
    # 测试无效的页码
    response = requests.get(
        "http://api.example.com/v1/users",
        headers={
            "Content-Type": "application/json",
            "Authorization": "Bearer your-token"
        },
        params={
            "page": -1,
            "limit": 20
        }
    )
    assert response.status_code == 400
    
    # 测试无效的Token
    response = requests.get(
        "http://api.example.com/v1/users",
        headers={
            "Content-Type": "application/json",
            "Authorization": "Bearer invalid-token"
        }
    )
    assert response.status_code == 401`
  },
  {
    key: 'boundary',
    name: '边界值测试',
    description: '测试参数边界值情况',
    template: `import requests
import pytest

@pytest.mark.parametrize("page,limit", [
    (0, 20),    # 最小页码
    (1000, 20), # 最大页码
    (1, 0),     # 最小每页数量
    (1, 100),   # 最大每页数量
])
def test_boundary_values(page, limit):
    """测试边界值场景"""
    response = requests.get(
        "http://api.example.com/v1/users",
        headers={
            "Content-Type": "application/json",
            "Authorization": "Bearer your-token"
        },
        params={
            "page": page,
            "limit": limit
        }
    )
    assert response.status_code in [200, 400]`
  },
  {
    key: 'invalid',
    name: '无效输入测试',
    description: '测试各种无效输入的处理',
    template: `import requests
import pytest

@pytest.mark.parametrize("invalid_param", [
    {"page": "abc"},           # 非数字页码
    {"limit": "xyz"},          # 非数字限制
    {"page": None},            # 空页码
    {"limit": None},           # 空限制
    {"invalid_key": "value"},  # 未知参数
])
def test_invalid_inputs(invalid_param):
    """测试无效输入场景"""
    response = requests.get(
        "http://api.example.com/v1/users",
        headers={
            "Content-Type": "application/json",
            "Authorization": "Bearer your-token"
        },
        params=invalid_param
    )
    assert response.status_code == 400`
  },
  {
    key: 'auth',
    name: '认证授权测试',
    description: '测试各种认证授权场景',
    template: `import requests
import pytest

def test_authentication():
    """测试认证授权场景"""
    # 测试无token
    response = requests.get(
        "http://api.example.com/v1/users",
        headers={"Content-Type": "application/json"}
    )
    assert response.status_code == 401
    
    # 测试过期token
    response = requests.get(
        "http://api.example.com/v1/users",
        headers={
            "Content-Type": "application/json",
            "Authorization": "Bearer expired-token"
        }
    )
    assert response.status_code == 401
    
    # 测试权限不足
    response = requests.get(
        "http://api.example.com/v1/users",
        headers={
            "Content-Type": "application/json",
            "Authorization": "Bearer low-privilege-token"
        }
    )
    assert response.status_code == 403`
  },
  {
    key: 'concurrent',
    name: '并发测试',
    description: '测试API在并发访问下的表现',
    template: `import requests
import pytest
from concurrent.futures import ThreadPoolExecutor
import time

def test_concurrent_access():
    """测试并发访问场景"""
    def make_request():
        return requests.get(
            "http://api.example.com/v1/users",
            headers={
                "Content-Type": "application/json",
                "Authorization": "Bearer your-token"
            }
        )
    
    # 创建10个并发请求
    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = [executor.submit(make_request) for _ in range(10)]
        responses = [f.result() for f in futures]
    
    # 验证所有请求都成功
    for response in responses:
        assert response.status_code == 200`
  },
  {
    key: 'performance',
    name: '性能测试',
    description: '测试API的性能指标',
    template: `import requests
import pytest
import time

def test_response_time():
    """测试响应时间"""
    start_time = time.time()
    response = requests.get(
        "http://api.example.com/v1/users",
        headers={
            "Content-Type": "application/json",
            "Authorization": "Bearer your-token"
        }
    )
    end_time = time.time()
    
    # 验证响应时间在200ms以内
    assert (end_time - start_time) < 0.2
    assert response.status_code == 200`
  },
  {
    key: 'dependency',
    name: '依赖服务测试',
    description: '测试与依赖服务的交互',
    template: `import requests
import pytest
from unittest.mock import patch

def test_dependency_service():
    """测试依赖服务场景"""
    # 模拟数据库服务异常
    with patch('database.connect') as mock_db:
        mock_db.side_effect = Exception("Database connection failed")
        response = requests.get(
            "http://api.example.com/v1/users",
            headers={
                "Content-Type": "application/json",
                "Authorization": "Bearer your-token"
            }
        )
        assert response.status_code == 503
        
    # 模拟缓存服务异常
    with patch('cache.get') as mock_cache:
        mock_cache.side_effect = Exception("Cache service unavailable")
        response = requests.get(
            "http://api.example.com/v1/users",
            headers={
                "Content-Type": "application/json",
                "Authorization": "Bearer your-token"
            }
        )
        assert response.status_code == 503`
  },
  {
    key: 'security',
    name: '安全测试',
    description: '测试各种安全相关场景',
    template: `import requests
import pytest

def test_security():
    """测试安全相关场景"""
    # SQL注入测试
    response = requests.get(
        "http://api.example.com/v1/users",
        headers={
            "Content-Type": "application/json",
            "Authorization": "Bearer your-token"
        },
        params={
            "keyword": "' OR '1'='1"
        }
    )
    assert response.status_code == 400
    
    # XSS测试
    response = requests.get(
        "http://api.example.com/v1/users",
        headers={
            "Content-Type": "application/json",
            "Authorization": "Bearer your-token"
        },
        params={
            "keyword": "<script>alert('xss')</script>"
        }
    )
    assert response.status_code == 400
    
    # 敏感信息泄露测试
    response = requests.get(
        "http://api.example.com/v1/users",
        headers={
            "Content-Type": "application/json",
            "Authorization": "Bearer your-token"
        }
    )
    data = response.json()
    assert "password" not in str(data)
    assert "salt" not in str(data)`
  }
];

const TestCaseEditor: React.FC = () => {
  const { selectedApi } = useApi();
  const [selectedScenario, setSelectedScenario] = useState<string>('normal');
  const [testCode, setTestCode] = useState<string>(TEST_SCENARIOS[0].template);

  useEffect(() => {
    const scenario = TEST_SCENARIOS.find(s => s.key === selectedScenario);
    if (scenario) {
      setTestCode(scenario.template);
    }
  }, [selectedScenario]);

  const handleRunTest = async () => {
    message.loading('正在执行测试...', 1);
    // TODO: 实现测试执行逻辑
    setTimeout(() => {
      message.success('测试执行成功！');
    }, 1000);
  };

  const handleSave = () => {
    message.success('测试用例已保存！');
  };

  const handleGenerateTestCase = () => {
    const scenario = TEST_SCENARIOS.find(s => s.key === selectedScenario);
    if (scenario) {
      setTestCode(scenario.template);
      message.success('测试用例已生成！');
    }
  };

  return (
    <div style={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#1e1e1e'
    }}>
      <div style={{ 
        padding: '16px',
        borderBottom: '1px solid #333',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Select
          value={selectedScenario}
          onChange={setSelectedScenario}
          style={{ width: 200 }}
          options={TEST_SCENARIOS.map(scenario => ({
            value: scenario.key,
            label: scenario.name,
            title: scenario.description
          }))}
        />
        <Space>
          <Button 
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={handleRunTest}
            ghost
          >
            运行测试
          </Button>
          <Button 
            icon={<SaveOutlined />}
            onClick={handleSave}
            ghost
          >
            保存
          </Button>
          <Button 
            icon={<CodeOutlined />}
            onClick={handleGenerateTestCase}
            ghost
          >
            一键生成测试用例
          </Button>
        </Space>
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <Editor
          height="100%"
          defaultLanguage="python"
          value={testCode}
          onChange={(value) => setTestCode(value || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            readOnly: false
          }}
        />
      </div>
    </div>
  );
};

export default TestCaseEditor; 
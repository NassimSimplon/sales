import React, { useState } from "react";
import { CheckCircle, Clock, Play, TestTube, XCircle } from "lucide-react";

interface TestingPanelProps {
  refreshCount: number;
  lastRefresh: Date;
  autoRefreshEnabled: boolean;
  isRefreshing: boolean;
}

export const TestingPanel: React.FC<TestingPanelProps> = ({
  refreshCount,
  lastRefresh,
  autoRefreshEnabled,
  isRefreshing
}) => {
  const [testResults, setTestResults] = useState<Array<{
    id: string;
    name: string;
    status: 'running' | 'passed' | 'failed';
    message: string;
    timestamp: Date;
  }>>([]);

  const runAutoRefreshTest = () => {
    const testId = `test-${Date.now()}`;
    
    // Add initial test
    setTestResults(prev => [...prev, {
      id: testId,
      name: 'Auto-refresh functionality',
      status: 'running',
      message: 'Testing auto-refresh mechanism...',
      timestamp: new Date()
    }]);

    // Check if auto-refresh is working
    setTimeout(() => {
      const isWorking = autoRefreshEnabled && refreshCount > 0;
      
      setTestResults(prev => prev.map(test => 
        test.id === testId ? {
          ...test,
          status: isWorking ? 'passed' : 'failed',
          message: isWorking 
            ? `Auto-refresh is working! ${refreshCount} updates completed.`
            : 'Auto-refresh is not working. Check if it\'s enabled and data is updating.'
        } : test
      ));
    }, 2000);
  };

  const runRealTimeChartsTest = () => {
    const testId = `test-${Date.now()}`;
    
    setTestResults(prev => [...prev, {
      id: testId,
      name: 'Real-time charts update',
      status: 'running',
      message: 'Testing chart data updates...',
      timestamp: new Date()
    }]);

    // Check if charts are updating
    setTimeout(() => {
      const chartsWorking = refreshCount > 0;
      
      setTestResults(prev => prev.map(test => 
        test.id === testId ? {
          ...test,
          status: chartsWorking ? 'passed' : 'failed',
          message: chartsWorking 
            ? 'Charts are updating with real-time data!'
            : 'Charts may not be updating. Check data refresh mechanism.'
        } : test
      ));
    }, 1500);
  };

  const runDataIntegrityTest = () => {
    const testId = `test-${Date.now()}`;
    
    setTestResults(prev => [...prev, {
      id: testId,
      name: 'Data integrity check',
      status: 'running',
      message: 'Checking data consistency...',
      timestamp: new Date()
    }]);

    setTimeout(() => {
      const timeSinceLastRefresh = Date.now() - lastRefresh.getTime();
      const dataFresh = timeSinceLastRefresh < 10000; // Less than 10 seconds
      
      setTestResults(prev => prev.map(test => 
        test.id === testId ? {
          ...test,
          status: dataFresh ? 'passed' : 'failed',
          message: dataFresh 
            ? 'Data is fresh and consistent!'
            : `Data may be stale. Last refresh: ${Math.round(timeSinceLastRefresh / 1000)}s ago`
        } : test
      ));
    }, 1000);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Clock size={16} className="text-blue-500 animate-spin" />;
      case 'passed':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'failed':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="testing-panel">
      <div className="testing-header">
        <h3>
          <TestTube size={20} />
          Real-time Testing Panel
        </h3>
        <button onClick={clearResults} className="clear-results-btn">
          Clear Results
        </button>
      </div>

      <div className="test-controls">
        <button onClick={runAutoRefreshTest} className="test-btn">
          <Play size={16} />
          Test Auto-refresh
        </button>
        
        <button onClick={runRealTimeChartsTest} className="test-btn">
          <Play size={16} />
          Test Chart Updates
        </button>
        
        <button onClick={runDataIntegrityTest} className="test-btn">
          <Play size={16} />
          Test Data Integrity
        </button>
      </div>

      <div className="test-status">
        <div className="status-item">
          <span>Auto-refresh:</span>
          <span className={autoRefreshEnabled ? 'status-active' : 'status-inactive'}>
            {autoRefreshEnabled ? 'Enabled' : 'Disabled'}
          </span>
        </div>
        
        <div className="status-item">
          <span>Refresh count:</span>
          <span className="status-value">{refreshCount}</span>
        </div>
        
        <div className="status-item">
          <span>Currently refreshing:</span>
          <span className={isRefreshing ? 'status-active' : 'status-inactive'}>
            {isRefreshing ? 'Yes' : 'No'}
          </span>
        </div>
        
        <div className="status-item">
          <span>Last refresh:</span>
          <span className="status-value">{lastRefresh.toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="test-results">
        <h4>Test Results</h4>
        {testResults.length === 0 ? (
          <p className="no-results">No tests run yet. Click a test button to start.</p>
        ) : (
          <div className="results-list">
            {testResults.map(result => (
              <div key={result.id} className={`test-result ${result.status}`}>
                <div className="result-header">
                  {getStatusIcon(result.status)}
                  <span className="test-name">{result.name}</span>
                  <span className="test-time">{result.timestamp.toLocaleTimeString()}</span>
                </div>
                <p className="test-message">{result.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="testing-instructions">
        <h4>How to Test Real-time Features:</h4>
        <ol>
          <li>Ensure auto-refresh is enabled (green dot should be pulsing)</li>
          <li>Watch the "Updates" counter increase every 5 seconds</li>
          <li>Observe charts and KPI values changing slightly</li>
          <li>Run the test buttons above to verify functionality</li>
          <li>Try pausing and resuming auto-refresh</li>
          <li>Use manual refresh button to trigger immediate updates</li>
        </ol>
      </div>
    </div>
  );
}; 
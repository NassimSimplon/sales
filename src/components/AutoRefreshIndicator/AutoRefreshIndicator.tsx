import React from "react";
import { Pause, Play, RefreshCw } from "lucide-react";

interface AutoRefreshIndicatorProps {
  isRefreshing: boolean;
  lastRefresh: Date;
  refreshCount: number;
  autoRefreshEnabled: boolean;
  onToggleAutoRefresh: () => void;
  onManualRefresh: () => void;
}

export const AutoRefreshIndicator: React.FC<AutoRefreshIndicatorProps> = ({
  isRefreshing,
  lastRefresh,
  refreshCount,
  autoRefreshEnabled,
  onToggleAutoRefresh,
  onManualRefresh
}) => {
  return (
    <div className="auto-refresh-controls">
      <div className="refresh-status">
        <div className={`refresh-indicator ${isRefreshing ? 'refreshing' : ''}`}>
          <div className={`refresh-dot ${autoRefreshEnabled ? 'active' : 'paused'}`}></div>
          <span className="refresh-text">
            {isRefreshing ? 'Refreshing...' : 'Live data'}
          </span>
        </div>
        
        <div className="refresh-info">
          <span>Last updated: {lastRefresh.toLocaleTimeString()}</span>
          <span>Updates: {refreshCount}</span>
        </div>
      </div>

      <div className="refresh-controls">
        <button
          className={`refresh-toggle ${autoRefreshEnabled ? 'active' : 'paused'}`}
          onClick={onToggleAutoRefresh}
          title={autoRefreshEnabled ? 'Pause auto-refresh' : 'Resume auto-refresh'}
        >
          {autoRefreshEnabled ? <Pause size={16} /> : <Play size={16} />}
          {autoRefreshEnabled ? 'Pause' : 'Resume'}
        </button>

        <button
          className="manual-refresh"
          onClick={onManualRefresh}
          disabled={isRefreshing}
          title="Manual refresh"
        >
          <RefreshCw size={16} className={isRefreshing ? 'spinning' : ''} />
          Refresh
        </button>
      </div>
    </div>
  );
};  
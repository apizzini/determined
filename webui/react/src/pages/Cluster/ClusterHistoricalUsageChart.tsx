import React from 'react';

import { GroupBy } from './ClusterHistoricalUsage';

interface ClusterHistoricalUsageChartProps {
  data: Record<string, number>[],
  time: string[],
  timeGroupBy: GroupBy,
}

const ClusterHistoricalUsageChart: React.FC<ClusterHistoricalUsageChartProps> = (
  { data, time, timeGroupBy }: ClusterHistoricalUsageChartProps,
) => {
  return (
    <div>
      <p>data: {JSON.stringify(data)}</p>
      <p>time: {JSON.stringify(time)}</p>
      <p>timeGroupBy: {JSON.stringify(timeGroupBy)}</p>
    </div>
  );
};

export default ClusterHistoricalUsageChart;

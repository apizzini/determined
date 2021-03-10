import React, { useEffect, useRef, useState } from 'react';
import uPlot, { Options } from 'uplot';

import useResize from 'hooks/useResize';

import css from './ClusterHistoricalUsageChart.module.scss';

interface ClusterHistoricalUsageChartProps {
  data: Record<string, number[]>,
  height?: number;
  time: string[],
}

const CHART_HEIGHT = 400;

const ClusterHistoricalUsageChart: React.FC<ClusterHistoricalUsageChartProps> = (
  { data, height = CHART_HEIGHT, time }: ClusterHistoricalUsageChartProps,
) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const resize = useResize(chartRef);
  const [ chart, setChart ] = useState<uPlot>();

  useEffect(() => {
    if (!chartRef.current) return;

    // console.log('data', data);
    const timeUnix: number[] = time.map(item => Date.parse(item) / 1000);

    const options = {
      axes: [
        {
          values: (self, splits) => {
            return splits.map(i => {
              const date = new Date(i * 1000);
              const M = date.getMonth() + 1;
              const MM = (M < 10 ? '0' : '') + M;
              const D = date.getDate();
              const DD = (D < 10 ? '0' : '') + D;
              return MM + '-' + DD;
            });
          },
        },
      ],
      height,
      series: [
        { value: '{YYYY}-{MM}-{DD}' },
        ...Object.keys(data).map(label => ({
          label: label,
          stroke: '#1f77b4',
          width: 2,
        })),
      ],
      width: chartRef.current.offsetWidth,
    } as Options;

    const plotChart = new uPlot(options, [ timeUnix, ...Object.values(data) ], chartRef.current);
    setChart(plotChart);

    return () => {
      setChart(undefined);
      plotChart.destroy();
    };
  }, [ data, height, time ]);

  // Resize the chart when resize events happen.
  useEffect(() => {
    if (chart) chart.setSize({ height, width: resize.width });
  }, [ chart, height, resize ]);

  return (
    <div className={css.base}>
      <div ref={chartRef} />
    </div>
  );
};

export default ClusterHistoricalUsageChart;

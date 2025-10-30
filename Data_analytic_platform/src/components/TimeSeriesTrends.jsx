import React from 'react';
import ReactECharts from 'echarts-for-react';

export default function TimeSeriesTrends({ timeColumn, seriesData }) {
  
  if (!timeColumn) {
    return (
      <div className="card time-series-chart" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <p style={{ color: 'var(--text-secondary)' }}>No valid time/date column found for trend analysis.</p>
      </div>
    );
  }

  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: seriesData.map(s => s.name),
      bottom: 0,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: seriesData[0].data.map(item => item.name), // Assumes all series share x-axis
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: { type: 'dashed', color: 'var(--border-color)' }
      }
    },
    series: seriesData
  };

  return (
    <div className="card time-series-chart">
      <div className="card-title">Trend Analysis: **{timeColumn}**</div>
      <ReactECharts option={option} style={{ height: '350px' }} />
    </div>
  );
}
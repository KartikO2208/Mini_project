import React from 'react';
import ReactECharts from 'echarts-for-react';

export default function ColumnDistributionChart({ columnName, chartData, onBarClick }) {
  const option = {
    tooltip: {
      trigger: 'item'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: chartData.map(item => item.name),
      axisLine: { show: false },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: { type: 'dashed', color: 'var(--border-color)' }
      }
    },
    dataZoom: [
      {
        type: 'inside', // Allows zooming with mouse wheel
        start: 0,
        end: 100
      },
      {
        type: 'slider', // Shows a scrollbar
        height: 20,
        bottom: 10,
        start: 0,
        end: 100
      }
    ],
    series: [
      {
        name: 'Count',
        type: 'bar',
        data: chartData.map(item => item.value),
        color: 'var(--primary-blue)',
        barWidth: '60%',
        emphasis: {
          itemStyle: {
            color: '#004ecc' // Darker blue on hover
          }
        }
      }
    ]
  };

  return (
    <div className="card column-dist-chart">
      <div className="card-title">Distribution of: **{columnName}**</div>
      <ReactECharts 
        option={option} 
        style={{ height: '350px' }} 
        onEvents={{ 'click': onBarClick }} 
      />
    </div>
  );
}
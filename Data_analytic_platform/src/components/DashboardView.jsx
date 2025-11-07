import React, { useState, useEffect } from 'react';
import useDashboardStore from '../store';

// Import all dashboard components
import KpiCard from './KpiCard';
import ActionableInsights from './ActionableInsights';
import DataDictionary from './DataDictionary';
import ColumnDistributionChart from './ColumnDistributionChart';
import TimeSeriesTrends from './TimeSeriesTrends';
import InteractiveDataTable from './InteractiveDataTable';
import DataHealthMonitoring from './DataHealthMonitoring';
import ReportAndAutomation from './ReportAndAutomation';
import CorrelationHeatmap from './CorrelationHeatmap';

// We use 'export default' to match your project's pattern
export default function DashboardView() {
  // Get data from the *pipeline* result
  const {
    pipeline_kpiData,
    pipeline_insights,
    pipeline_dictionary,
    pipeline_columnDist,
    pipeline_timeSeries,
    pipeline_tableData,
    pipeline_dataHealth,
    pipeline_correlationMatrix
  } = useDashboardStore();
  
  const [selectedColumn, setSelectedColumn] = useState(null);

  useEffect(() => {
    // When the data loads, set the default column for the chart
    if (pipeline_columnDist) {
      setSelectedColumn(pipeline_columnDist.columnName);
    }
  }, [pipeline_columnDist]);

  // If no analysis has been run yet, show a helpful message
  if (!pipeline_kpiData) {
    return (
      <div className="card" style={{marginTop: '24px', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <p style={{color: 'var(--text-secondary)', fontSize: '1.2rem', textAlign: 'center'}}>
          Welcome! Go to the "Pipeline Builder" tab,<br/>
          build a pipeline with an "Analyze" node, and click "Run".<br/>
          Your dashboard will appear here.
        </p>
      </div>
    );
  }

  // This is the same dashboard layout as before
  return (
    <div className="dashboard-layout" style={{padding: '24px 0'}}> {/* Remove page padding */}
      
      {/* --- KPIs --- */}
      <KpiCard
        gridArea="kpi-1"
        title="Total Records"
        value={pipeline_kpiData.totalRecords}
        delta={pipeline_kpiData.totalRecordsDelta}
      />
      <KpiCard
        gridArea="kpi-2"
        title="Data Quality"
        value={pipeline_kpiData.dataQuality}
        delta={pipeline_kpiData.dataQualityDelta}
      />
      <KpiCard
        gridArea="kpi-3"
        title="Columns"
        value={pipeline_kpiData.columns}
        delta={pipeline_kpiData.columnsDelta}
      />
      <KpiCard
        gridArea="kpi-4"
        title="Total Anomalies"
        value={pipeline_kpiData.anomalies}
        delta={pipeline_kpiData.anomaliesDelta}
        deltaType={pipeline_kpiData.anomaliesDeltaType}
      />

      {/* --- Insights & Dictionary --- */}
      <ActionableInsights insights={pipeline_insights} />
      <DataDictionary dictionary={pipeline_dictionary} />

      {/* --- Charts --- */}
      <ColumnDistributionChart 
        chartData={pipeline_columnDist.chartData}
        columnName={selectedColumn}
      />
      <TimeSeriesTrends 
        timeColumn={pipeline_timeSeries.timeColumn}
        seriesData={pipeline_timeSeries.seriesData} 
        xAxisData={pipeline_timeSeries.xAxisData}
      />

      {/* --- Table & Heatmap --- */}
      <InteractiveDataTable 
        rowData={pipeline_tableData.rowData} 
        columnDefs={pipeline_tableData.columnDefs}
        onColumnHeaderClick={(col) => setSelectedColumn(col)} 
      />
      
      <div className="correlation-heatmap">
        <CorrelationHeatmap heatmapData={pipeline_correlationMatrix} />
      </div>

      {/* --- Side Cards --- */}
      <div className="health-report-stack">
        <DataHealthMonitoring healthData={pipeline_dataHealth} />
        <ReportAndAutomation />
      </div>
    </div>
  );
}
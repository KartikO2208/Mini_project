import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboardStore } from '../store'; // Import the store
import '../App.css'; 

// Import all dashboard components
import Navbar from '../components/Navbar';
import KpiCard from '../components/KpiCard';
import ActionableInsights from '../components/ActionableInsights';
import DataDictionary from '../components/DataDictionary';
import ColumnDistributionChart from '../components/ColumnDistributionChart';
import TimeSeriesTrends from '../components/TimeSeriesTrends';
import InteractiveDataTable from '../components/InteractiveDataTable';
import DataHealthMonitoring from '../components/DataHealthMonitoring';
import ReportAndAutomation from '../components/ReportAndAutomation';

export default function DashboardPage() {
  // --- 1. Get all data from the global store ---
  const {
    kpiData,
    insights,
    dictionary,
    columnDist,
    timeSeries,
    tableData,
    dataHealth
  } = useDashboardStore();
  
  const navigate = useNavigate();
  
  // This state will track the user-selected column
  const [selectedColumn, setSelectedColumn] = useState(null);

  // --- 2. Add a "guard" ---
  useEffect(() => {
    if (!kpiData) {
      console.log("No data found, redirecting to upload page.");
      navigate('/');
    } else {
      // Set the default column for the chart when data first loads
      setSelectedColumn(columnDist.columnName);
    }
  }, [kpiData, navigate, columnDist]);

  // --- 3. Add a "loading" state ---
  if (!kpiData) {
    return (
      <div style={{
        display: 'flex', 
        height: '100vh', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: 'var(--bg-color)',
        color: 'var(--text-primary)'
      }}>
        <h2>Loading Analysis Data...</h2>
      </div>
    );
  }

  // --- 4. Render the dashboard with REAL data ---
  return (
    <div className="dashboard-layout">
      <Navbar />

      <KpiCard
        gridArea="kpi-1"
        title="Total Records"
        value={kpiData.totalRecords}
        delta={kpiData.totalRecordsDelta}
      />
      <KpiCard
        gridArea="kpi-2"
        title="Data Quality"
        value={kpiData.dataQuality}
        delta={kpiData.dataQualityDelta}
      />
      <KpiCard
        gridArea="kpi-3"
        title="Columns"
        value={kpiData.columns}
        delta={kpiData.columnsDelta}
      />
      <KpiCard
        gridArea="kpi-4"
        title="Total Anomalies"
        value={kpiData.anomalies}
        delta={kpiData.anomaliesDelta}
        deltaType={kpiData.anomaliesDeltaType}
      />

      <ActionableInsights insights={insights} />
      <DataDictionary dictionary={dictionary} />

      <ColumnDistributionChart 
        chartData={columnDist.chartData}
        columnName={selectedColumn} // Use the state variable here
      />
      <TimeSeriesTrends 
        seriesData={timeSeries.seriesData} 
        timeColumn={timeSeries.timeColumn}
      />

      <InteractiveDataTable 
        rowData={tableData.rowData} 
        columnDefs={tableData.columnDefs}
        // This is the interaction! Clicking a header changes the chart.
        onColumnHeaderClick={(col) => setSelectedColumn(col)} 
      />
      
      <DataHealthMonitoring healthData={dataHealth} />
      <ReportAndAutomation />
    </div>
  );
}
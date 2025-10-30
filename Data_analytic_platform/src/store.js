import { create } from 'zustand';

// This store will hold all the data for our dashboard
export const useDashboardStore = create((set) => ({
  // --- Initial state is all null ---
  kpiData: null,
  insights: null,
  dictionary: null,
  columnDist: null,
  timeSeries: null,
  tableData: null,
  dataHealth: null,
  
  // --- This function will be called by UploadPage ---
  setAnalysisData: (data) => set({
    kpiData: data.kpiData,
    insights: data.insights,
    dictionary: data.dictionary,
    columnDist: data.columnDist,
    timeSeries: data.timeSeries,
    tableData: data.tableData,
    dataHealth: data.dataHealth,
  }),
  
  // --- This function can be used to clear data on (e.g.) logout ---
  clearAnalysisData: () => set({
    kpiData: null,
    insights: null,
    dictionary: null,
    columnDist: null,
    timeSeries: null,
    tableData: null,
    dataHealth: null,
  }),
}));
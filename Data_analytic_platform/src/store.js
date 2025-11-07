import { create } from 'zustand';

// We use 'export default' to match your project's pattern
export default create((set) => ({
  // The raw file, for the pipeline to use
  file: null,
  
  // Data for the *initial* analysis (from UploadPage)
  // We keep this to remember the original state
  kpiData: null,
  insights: null,
  dictionary: null,
  columnDist: null,
  timeSeries: null,
  tableData: null,
  dataHealth: null,
  correlationMatrix: null,
  
  // Data for the *pipeline* result (this is what the Dashboard tab shows)
  pipeline_kpiData: null,
  pipeline_insights: null,
  pipeline_dictionary: null,
  pipeline_columnDist: null,
  pipeline_timeSeries: null,
  pipeline_tableData: null,
  pipeline_dataHealth: null,
  pipeline_correlationMatrix: null,
  
  // This is called from UploadPage
  setInitialAnalysis: (file, data) => set({
    file: file,
    
    // Set the "original" data
    kpiData: data?.kpiData || null,
    insights: data?.insights || null,
    dictionary: data?.dictionary || null,
    columnDist: data?.columnDist || null,
    timeSeries: data?.timeSeries || null,
    tableData: data?.tableData || null,
    dataHealth: data?.dataHealth || null,
    correlationMatrix: data?.correlationMatrix || null,
    
    // ALSO set the "pipeline" data, so the dashboard shows the initial analysis
    pipeline_kpiData: data?.kpiData || null,
    pipeline_insights: data?.insights || null,
    pipeline_dictionary: data?.dictionary || null,
    pipeline_columnDist: data?.columnDist || null,
    pipeline_timeSeries: data?.timeSeries || null,
    pipeline_tableData: data?.tableData || null,
    pipeline_dataHealth: data?.dataHealth || null,
    pipeline_correlationMatrix: data?.correlationMatrix || null,
  }),
  
  // This is called from PipelineView when an "Analyze" node runs
  setPipelineData: (data) => set({
    pipeline_kpiData: data?.kpiData || null,
    pipeline_insights: data?.insights || null,
    pipeline_dictionary: data?.dictionary || null,
    pipeline_columnDist: data?.columnDist || null,
    pipeline_timeSeries: data?.timeSeries || null,
    pipeline_tableData: data?.tableData || null,
    pipeline_dataHealth: data?.dataHealth || null,
    pipeline_correlationMatrix: data?.correlationMatrix || null,
  }),
  
  // This is called from the Navbar
  clearAnalysisData: () => set({
    file: null,
    kpiData: null, insights: null, dictionary: null, columnDist: null,
    timeSeries: null, tableData: null, dataHealth: null, correlationMatrix: null,
    pipeline_kpiData: null, pipeline_insights: null, pipeline_dictionary: null,
    pipeline_columnDist: null, pipeline_timeSeries: null, pipeline_tableData: null,
    pipeline_dataHealth: null, pipeline_correlationMatrix: null,
  }),
}));
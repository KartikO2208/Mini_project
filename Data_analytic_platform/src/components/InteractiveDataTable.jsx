import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Search } from 'lucide-react';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Theme

export default function InteractiveDataTable({ rowData, columnDefs, onColumnHeaderClick }) {
  const [gridApi, setGridApi] = useState(null);

  const onGridReady = (params) => {
    setGridApi(params.api);
    
    // --- This is the interaction! ---
    // Add event listener for column header clicks
    params.api.addEventListener('columnHeaderClicked', (event) => {
      // We check if the column is categorical before updating the chart
      const colDef = event.column.getColDef();
      const firstRow = params.api.getRowNode('0');
      if (firstRow && typeof firstRow.data[colDef.field] === 'string') {
        onColumnHeaderClick(colDef.field);
      } else {
        console.log(`Column ${colDef.field} is numeric, not updating chart.`);
      }
    });
  };

  // Live search filtering
  const onSearchChange = (event) => {
    gridApi.setQuickFilter(event.target.value);
  };

  return (
    <div className="card data-table" style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div className="card-title" style={{ marginBottom: '0' }}>Data Preview (First 100 Rows)</div>
        <div style={{ position: 'relative', width: '250px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Filter table data..." 
            onChange={onSearchChange}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              fontSize: '0.875rem',
            }}
          />
        </div>
      </div>
      
      {/* The AG Grid component */}
      <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          onGridReady={onGridReady}
          pagination={true}
          paginationPageSize={10}
          defaultColDef={{
            flex: 1,
            minWidth: 150,
            resizable: true,
          }}
        />
      </div>
    </div>
  );
}
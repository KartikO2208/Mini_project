import pandas as pd
import io
import json
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# --- Make sure this import is correct ---
from app.analysis_utils import (
    read_uploaded_file_to_df, # <-- THIS IS THE CRITICAL IMPORT
    get_kpis,
    get_actionable_insights,
    get_data_dictionary,
    get_column_distribution,
    get_time_series_data,
    get_table_data,
    get_data_health,
    get_correlation_matrix
)

# --- This import must be correct too ---
from app.core.workflow.workflow import WorkflowExecutor

app = FastAPI(
    title="Data Analytics Platform API",
    description="API for processing files and running analytics dashboards & pipelines.",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ENDPOINT 1: For the initial UploadPage ---
@app.post("/api/v1/analyze")
async def analyze_file(
    file: UploadFile = File(...),
    col_dist_target: str = Form(None),
    col_time_target: str = Form(None)
):
    try:
        contents = await file.read()
        
        # --- THIS IS THE LINE THAT FIXES THE ERROR ---
        # It calls your smart function instead of pd.read_csv
        df = read_uploaded_file_to_df(contents, file.filename)
        # --- END OF FIX ---

        # Run all analysis modules
        kpis = get_kpis(df)
        correlation_result = get_correlation_matrix(df)
        time_series_result = get_time_series_data(df, target_column=col_time_target) 
        insights = get_actionable_insights(df, kpis, correlation_result['matrix'])
        
        response_data = {
            "kpiData": kpis,
            "insights": insights,
            "dictionary": get_data_dictionary(df),
            "columnDist": get_column_distribution(df, target_column=col_dist_target),
            "timeSeries": time_series_result,
            "tableData": get_table_data(df),
            "dataHealth": get_data_health(df),
            "correlationMatrix": {
                "columns": correlation_result['columns'],
                "data": correlation_result['data']
            }
        }
        
        return response_data
        
    except Exception as e:
        import traceback
        traceback.print_exc() 
        raise HTTPException(status_code=500, detail=str(e))

# --- ENDPOINT 2: For the Pipeline Builder Page ---
@app.post("/workflow/run/")
async def run_workflow(
    file: UploadFile = File(...),
    pipeline_json: str = Form(...)
):
    try:
        file_contents = await file.read()
        pipeline_data = json.loads(pipeline_json)
        nodes_list = pipeline_data.get('nodes', [])
        edges_list = pipeline_data.get('edges', [])
        
        executor = WorkflowExecutor(
            nodes=nodes_list, 
            edges=edges_list, 
            file_contents=file_contents,
            file_name=file.filename # Pass the filename
        )
        
        result = executor.run()
        
        return {"success": True, "result": result}
        
    except Exception as e:
        print(f"Error during workflow execution: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {"status": "Backend server is running!"}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
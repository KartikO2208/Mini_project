import pandas as pd
import io
import json
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# --- Import for Dashboard Analytics ---
from app.analysis_utils import (
    get_kpis,
    get_actionable_insights,
    get_data_dictionary,
    get_column_distribution,
    get_time_series_data,
    get_table_data,
    get_data_health,
    get_correlation_matrix
)

# --- Import for Pipeline Workflow ---
from app.core.workflow.workflow import WorkflowExecutor

app = FastAPI(
    title="Data Analytics Platform API",
    description="API for processing files and running analytics dashboards & pipelines.",
    version="2.0.0" # Upgraded to v2.0
)

# --- CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Your React app
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
    """
    This endpoint runs the *initial* full analysis when the user
    first uploads a file.
    """
    try:
        contents = await file.read()
        try:
            df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        except UnicodeDecodeError:
            df = pd.read_csv(io.StringIO(contents.decode('latin-1')))
        
        # Run all analysis modules
        kpis = get_kpis(df)
        correlation_result = get_correlation_matrix(df)
        time_series_result = get_time_series_data(df, target_column=col_time_target) 
        insights = get_actionable_insights(df, kpis, correlation_result['matrix'])
        
        # Build the final JSON response
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
        raise HTTPException(status_code=500, detail=f"Error analyzing file: {e}")

# --- ENDPOINT 2: For the Pipeline Builder Page ---
@app.post("/workflow/run/")
async def run_workflow(
    file: UploadFile = File(...),    # The user's uploaded file
    pipeline_json: str = Form(...)   # The pipeline (nodes/edges) as a JSON string
):
    """
    This endpoint receives a pipeline and a file from the 
    PipelineBuilderPage, executes it, and returns the result
    from the final node.
    """
    try:
        # 1. Read the file contents
        file_contents = await file.read()
        
        # 2. Parse the JSON string back into a dict
        pipeline_data = json.loads(pipeline_json)
        nodes_list = pipeline_data.get('nodes', [])
        edges_list = pipeline_data.get('edges', [])
        
        print(f"Received {len(nodes_list)} nodes and {len(edges_list)} edges.")

        # 3. Instantiate the executor
        executor = WorkflowExecutor(
            nodes=nodes_list, 
            edges=edges_list, 
            file_contents=file_contents
        )
        
        # 4. Run the executor
        result = executor.run()
        
        # 'result' is a JSON string (from the final node)
        return {"success": True, "result": result}
        
    except Exception as e:
        print(f"Error during workflow execution: {e}")
        import traceback
        traceback.print_exc() # Print full error for debugging
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    """A simple root endpoint to check if the server is running."""
    return {"status": "Backend server is running!"}

# --- This allows running the file directly with `python app/main.py` ---
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
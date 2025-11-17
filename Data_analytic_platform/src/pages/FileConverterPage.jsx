import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UploadCloud, Download, Loader2, RefreshCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/FileConverterPage.css';

const formatOptions = [
  { value: 'csv', label: 'CSV (.csv)' },
  { value: 'json', label: 'JSON (.json)' },
  { value: 'parquet', label: 'Parquet (.parquet)' },
];

export default function FileConverterPage() {
  const [file, setFile] = useState(null);
  const [targetFormat, setTargetFormat] = useState('csv');
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [downloadName, setDownloadName] = useState('');

  useEffect(() => {
    return () => {
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [downloadUrl]);

  const handleFileChange = (event) => {
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }
    setError(null);
    setFile(event.target.files[0] || null);
  };

  const handleConvert = async () => {
    if (!file) {
      setError('Please upload a file to convert.');
      return;
    }

    setIsConverting(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('target_format', targetFormat);

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/v1/convert',
        formData,
        { responseType: 'blob' }
      );

      const contentDisposition = response.headers['content-disposition'];
      let filename = `${file.name.split('.')[0]}_converted.${targetFormat}`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename\*?=([^;]+)/);
        if (match) {
          filename = match[1].replace(/(^"|"$)/g, '');
        }
      }

      const blobUrl = URL.createObjectURL(response.data);
      setDownloadUrl(blobUrl);
      setDownloadName(filename);
    } catch (err) {
      const detail =
        err.response?.data?.detail ||
        'Unable to convert this file. Please check the file format.';
      setError(detail);
    } finally {
      setIsConverting(false);
    }
  };

  const resetState = () => {
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
    }
    setFile(null);
    setDownloadUrl(null);
    setError(null);
  };

  return (
    <div className="converter-page">
      <header className="converter-header">
        <div>
          <p className="converter-eyebrow">Utilities / File Converter</p>
          <h1>Convert Between CSV, JSON, and Parquet</h1>
          <p className="converter-subtitle">
            Upload a data file and instantly convert it to a different format. We keep your
            data structure intact, including column names and data types.
          </p>
        </div>
        <Link to="/home" className="converter-link">
          ← Back to Toolkit
        </Link>
      </header>

      <section className="converter-card">
        <div className="upload-section">
          <label className="upload-label">
            <UploadCloud size={24} />
            <div>
              <span>Upload a file</span>
              <p>Supported formats: CSV, Excel, JSON, Parquet, Feather, HDF5</p>
            </div>
            <input
              type="file"
              accept=".csv,.xlsx,.xls,.json,.parquet,.feather,.h5"
              onChange={handleFileChange}
            />
          </label>
          {file && (
            <div className="file-meta">
              <p>
                <strong>Selected:</strong> {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </p>
              <button className="link-button" onClick={resetState}>
                <RefreshCcw size={16} /> Change file
              </button>
            </div>
          )}
        </div>

        <div className="converter-controls">
          <div>
            <label>Choose target format</label>
            <select
              value={targetFormat}
              onChange={(event) => setTargetFormat(event.target.value)}
            >
              {formatOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <button
            className="convert-button"
            onClick={handleConvert}
            disabled={!file || isConverting}
          >
            {isConverting ? (
              <>
                <Loader2 className="spin" size={18} /> Converting…
              </>
            ) : (
              'Convert File'
            )}
          </button>
        </div>

        {error && <div className="converter-error">{error}</div>}

        {downloadUrl && (
          <div className="converter-result">
            <p>Conversion ready! Click below to download your new file.</p>
            <a className="download-link" href={downloadUrl} download={downloadName}>
              <Download size={16} /> Download {downloadName}
            </a>
          </div>
        )}
      </section>

      <section className="converter-faq">
        <h3>How it works</h3>
        <ul>
          <li>
            We detect your source format automatically using the same parser that powers the
            analytics workflow.
          </li>
          <li>
            CSV and JSON downloads are UTF-8 encoded. Parquet downloads preserve column data
            types when possible.
          </li>
          <li>
            For very large files (&gt;10MB), the conversion happens in-memory. Browser
            downloads may take a few extra seconds.
          </li>
        </ul>
      </section>
    </div>
  );
}


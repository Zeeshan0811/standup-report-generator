'use client';

import { useState, useEffect } from 'react';
import { convertJsonToCsv, downloadCsv } from '../utils/jsonToCsv';

export default function JsonToCsvConverter() {
    const [jsonInput, setJsonInput] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [fileName, setFileName] = useState('data');
    const [isLoading, setIsLoading] = useState(false);
    const [previewData, setPreviewData] = useState(null);

    const handleConvert = () => {
        try {
            setIsLoading(true);
            setError('');
            setSuccess('');

            if (!jsonInput.trim()) {
                // setError('Please enter JSON data');
                // setIsLoading(false);
                return;
            }

            const jsonData = JSON.parse(jsonInput);
            const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];

            if (dataArray.length === 0) {
                setError('JSON data cannot be empty');
                setIsLoading(false);
                return;
            }

            // Set preview data
            setPreviewData(dataArray.slice(0, 5));

            const csvContent = convertJsonToCsv(dataArray);
            // downloadCsv(csvContent, fileName);

            setSuccess(`Successfully converted ${dataArray.length} records to CSV!`);

            setTimeout(() => setSuccess(''), 3000);

        } catch (err) {
            setError('Invalid JSON format: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = () => {
        try {
            if (!previewData || previewData.length === 0) {
                setError('No data to download');
                return;
            }
            const csvContent = convertJsonToCsv(previewData);
            downloadCsv(csvContent, fileName);
        } catch (err) {
            setError('Error downloading file: ' + err.message);
        }
    }

    const handleExampleData = () => {
        const exampleData = [
            {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                age: 30,
                city: 'New York',
                status: 'Active',
                joinDate: '2024-01-15'
            },
            {
                id: 2,
                name: 'Jane Smith',
                email: 'jane@example.com',
                age: 25,
                city: 'Los Angeles',
                status: 'Active',
                joinDate: '2024-02-20'
            },
            {
                id: 3,
                name: 'Bob Johnson',
                email: 'bob@example.com',
                age: 35,
                city: 'Chicago',
                status: 'Inactive',
                joinDate: '2024-03-10'
            },
            {
                id: 4,
                name: 'Sarah Williams',
                email: 'sarah@example.com',
                age: 28,
                city: 'Miami',
                status: 'Active',
                joinDate: '2024-04-05'
            }
        ];
        setJsonInput(JSON.stringify(exampleData, null, 2));
        setError('');
        setSuccess('');
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setJsonInput(e.target.result);
                setError('');
                setSuccess('');
            };
            reader.onerror = () => {
                setError('Error reading file');
            };
            reader.readAsText(file);
        }
    };

    const handleClear = () => {
        setJsonInput('');
        setError('');
        setSuccess('');
        setPreviewData(null);
    };

    const handleFormatJson = () => {
        try {
            if (!jsonInput.trim()) {
                setError('No JSON to format');
                return;
            }
            const parsed = JSON.parse(jsonInput);
            setJsonInput(JSON.stringify(parsed, null, 2));
            setError('');
            setSuccess('JSON formatted successfully!');
            setTimeout(() => setSuccess(''), 2000);
        } catch (err) {
            setError('Cannot format invalid JSON');
        }
    };

    useEffect(() => {
        handleConvert();
    }, [jsonInput]);

    return (
        <div className="container-fluid py-3">
            <div className="text-center mb-3">
                {/* <div className="mb-3">
                    <i className="bi bi-filetype-json fs-1 text-primary me-2"></i>
                    <i className="bi bi-arrow-right-short fs-1 text-secondary"></i>
                    <i className="bi bi-filetype-csv fs-1 text-success ms-2"></i>
                </div> */}
                <h3 className="fw-bold mb-3 mb-3">JSON to CSV Converter</h3>
                <p className="lead text-muted">
                    Convert your JSON data to CSV format with just one click
                </p>
            </div>
            <div className="row justify-content-center">
                <div className="col-md-6">
                    {/* Header */}

                    {/* Main Card */}
                    <div className="card shadow-sm border-0 rounded-4">
                        <div className="card-header bg-success text-white">
                            <h4 className="mb-0 text-white">
                                <i className="bi bi-filetype-json me-2"></i>
                                Input or Upload
                            </h4>
                        </div>
                        <div className="card-body">
                            <div className="row ">
                                {/* File Name Input */}
                                <div className="col-md-4 mb-4">
                                    <label className="form-label fw-semibold">
                                        <i className="bi bi-tag me-2"></i>
                                        File Name
                                    </label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            value={fileName}
                                            onChange={(e) => setFileName(e.target.value)}
                                            className="form-control form-control-lg"
                                            placeholder="output.csv"
                                        />
                                        <span className="input-group-text bg-light">.csv</span>
                                    </div>
                                    <div className="form-text">Choose a downloadable file name</div>
                                </div>

                                {/* Upload Area */}
                                <div className="mb-4 col-md-8">
                                    <label className="form-label fw-semibold">
                                        <i className="bi bi-cloud-upload me-2"></i>
                                        Upload JSON File
                                    </label>
                                    <div className="input-group">
                                        <input
                                            type="file"
                                            accept=".json"
                                            onChange={handleFileUpload}
                                            className="form-control form-control-lg"
                                            id="fileUpload"
                                        />
                                        <label className="input-group-text bg-primary text-white" htmlFor="fileUpload">
                                            <i className="bi bi-folder2-open"></i> Browse
                                        </label>
                                    </div>
                                    <div className="form-text">Supported format: .json</div>
                                </div>

                                {/* JSON Input Area */}
                                <div className="mb-4">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <label className="form-label fw-semibold mb-0">
                                            <i className="bi bi-code-square me-2"></i>
                                            JSON Data
                                        </label>
                                        <div>
                                            {/* Example Button */}
                                            <button
                                                onClick={handleExampleData}
                                                className="btn btn-sm btn-outline-primary me-2"
                                            >
                                                <i className="bi bi-lightbulb"></i>
                                                Example Data
                                            </button>


                                            <button
                                                onClick={handleFormatJson}
                                                className="btn btn-sm btn-outline-secondary me-2"
                                                title="Format JSON"
                                            >
                                                <i className="bi bi-braces"></i> Format
                                            </button>
                                            <button
                                                onClick={handleClear}
                                                className="btn btn-sm btn-outline-danger"
                                                title="Clear"
                                            >
                                                <i className="bi bi-trash"></i> Clear
                                            </button>
                                        </div>
                                    </div>
                                    <textarea
                                        value={jsonInput}
                                        onChange={(e) => setJsonInput(e.target.value)}
                                        className="form-control font-monospace"
                                        style={{ height: '300px', fontSize: '14px' }}
                                        placeholder='[
  {
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30
  },
  {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "age": 25
  }
]'
                                    />
                                    <div className="form-text mt-2">
                                        <i className="bi bi-info-circle"></i>
                                        Paste your JSON array or object here
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className='card'>
                        <div className="card-header bg-success text-white">
                            <h4 className="mb-0 text-white">
                                <i className="bi bi-filetype-csv me-2"></i>
                                Preview & Download
                            </h4>
                        </div>
                        <div className="card-body">
                            {/* Alerts */}
                            {error && (
                                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                    {error}
                                    <button type="button" className="btn-close" onClick={() => setError('')}></button>
                                </div>
                            )}

                            {success && (
                                <div className="alert alert-success alert-dismissible fade show" role="alert">
                                    <i className="bi bi-check-circle-fill me-2"></i>
                                    {success}
                                    <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
                                </div>
                            )}

                            {/* Preview Section */}
                            {previewData && previewData.length > 0 && (
                                <div className="mt-2">
                                    <div className="d-flex align-items-center mb-3">
                                        <i className="bi bi-eye fs-4 me-2 text-primary"></i>
                                        <h5 className="mb-0 fw-semibold">Data Preview</h5>
                                        <span className="badge bg-primary ms-3">
                                            {previewData.length} {previewData.length === 1 ? 'record' : 'records'} shown
                                        </span>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table table-hover table-bordered">
                                            <thead className="table-light">
                                                <tr>
                                                    {Object.keys(previewData[0]).map((key) => (
                                                        <th key={key} className="text-nowrap">
                                                            <i className="bi bi-table me-1"></i>
                                                            {key}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {previewData.map((row, idx) => (
                                                    <tr key={idx}>
                                                        {Object.values(row).map((value, valIdx) => (
                                                            <td key={valIdx}>
                                                                {typeof value === 'object'
                                                                    ? JSON.stringify(value)
                                                                    : String(value).slice(0, 50)}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    {previewData.length < 5 && jsonInput && (
                                        <p className="text-muted small mt-2">
                                            <i className="bi bi-info-circle"></i> Showing all records
                                        </p>
                                    )}

                                    {/* Convert Button */}
                                    <button
                                        onClick={handleDownload}
                                        disabled={isLoading}
                                        className="btn btn-primary btn-lg w-100 mb-4"
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Converting...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-download me-2"></i>
                                                Download CSV
                                            </>
                                        )}
                                    </button>
                                </div>


                            )}


                        </div>
                    </div>
                </div>

            </div>

            <div className="row justify-content-center mb-5">
                {/* Features Section */}
                <div className="mt-5 pt-3">
                    <hr className="my-4" />
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="text-center">
                                <div className="mb-3">
                                    <i className="bi bi-filetype-json fs-2 text-primary"></i>
                                </div>
                                <h6 className="fw-semibold">Multiple Formats</h6>
                                <small className="text-muted">
                                    Supports JSON arrays and objects
                                </small>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="text-center">
                                <div className="mb-3">
                                    <i className="bi bi-shield-check fs-2 text-success"></i>
                                </div>
                                <h6 className="fw-semibold">Secure & Private</h6>
                                <small className="text-muted">
                                    All conversion happens in your browser
                                </small>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="text-center">
                                <div className="mb-3">
                                    <i className="bi bi-speedometer2 fs-2 text-info"></i>
                                </div>
                                <h6 className="fw-semibold">Fast Processing</h6>
                                <small className="text-muted">
                                    Instant conversion with preview
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

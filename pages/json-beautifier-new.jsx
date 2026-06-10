'use client';
import { useState, useRef, useCallback } from "react";
import Editor, { OnChange } from "@monaco-editor/react";
import { Toast, ToastContainer } from "react-bootstrap";


export default function JsonBeautifier() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [csvFilename, setCsvFilename] = useState("data_export");
    const [csvDelimiter, setCsvDelimiter] = useState(",");
    const [flattenNested, setFlattenNested] = useState(true);
    const [sortKeys, setSortKeys] = useState(false);
    const [minifyOutput, setMinifyOutput] = useState(false);
    const [toasts, setToasts] = useState([]);
    const [urlInput, setUrlInput] = useState("");
    const [selectedFormat, setSelectedFormat] = useState("beautify");

    const editorRef = useRef(null);

    // Toast notification helper
    const addToast = (message, type) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, 3000);
    };

    // Sort object keys recursively
    const sortObjectKeys = (obj) => {
        if (obj === null || typeof obj !== 'object') return obj;
        if (Array.isArray(obj)) return obj.map(sortObjectKeys);
        return Object.keys(obj).sort().reduce((sorted, key) => {
            sorted[key] = sortObjectKeys(obj[key]);
            return sorted;
        }, {});
    };

    // Format JSON based on current settings
    const formatJson = (jsonString) => {
        try {
            let parsed = JSON.parse(jsonString);

            if (sortKeys) {
                parsed = sortObjectKeys(parsed);
            }

            if (minifyOutput || selectedFormat === "minify") {
                return JSON.stringify(parsed);
            } else {
                return JSON.stringify(parsed, null, 2);
            }
        } catch {
            throw new Error("Invalid JSON");
        }
    };

    // Beautify JSON immediately
    const beautifyJson = (value) => {
        if (!value.trim()) {
            setOutput("");
            setError("");
            return;
        }

        try {
            const formatted = formatJson(value);
            setOutput(formatted);
            setError("");
        } catch {
            setOutput("");
            setError("⚠️ Invalid JSON syntax");
        }
    };

    // Handle editor changes
    const handleInputChange = (value) => {
        const val = value || "";
        setInput(val);
        beautifyJson(val);
    };

    // Upload JSON file
    const handleFileUpload = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result;
            setInput(content);
            beautifyJson(content);
            addToast(`Loaded ${file.name} successfully`, 'success');
        };
        reader.onerror = () => {
            addToast('Failed to read file', 'error');
        };
        reader.readAsText(file);
    };

    // Fetch JSON from URL
    const fetchFromUrl = async () => {
        if (!urlInput.trim()) {
            addToast('Please enter a URL', 'error');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(urlInput);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            const jsonString = JSON.stringify(data, null, 2);
            setInput(jsonString);
            beautifyJson(jsonString);
            addToast('JSON fetched successfully', 'success');
        } catch (err) {
            addToast(`Failed to fetch: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error');
            setError("Failed to fetch JSON from URL");
        } finally {
            setIsLoading(false);
        }
    };

    // Convert JSON to CSV (flatten nested objects)
    const jsonToCSV = (jsonData, delimiter = ",") => {
        if (!jsonData) return "";

        let data = [];

        // Handle array or single object
        if (Array.isArray(jsonData)) {
            data = jsonData;
        } else {
            data = [jsonData];
        }

        if (data.length === 0) return "";

        // Extract all unique keys (flattened if option enabled)
        const getAllKeys = (obj, prefix = '') => {
            let keys = [];
            for (const key in obj) {
                const fullKey = prefix ? `${prefix}.${key}` : key;
                if (flattenNested && obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                    keys = [...keys, ...getAllKeys(obj[key], fullKey)];
                } else {
                    keys.push(fullKey);
                }
            }
            return keys;
        };

        const allKeys = Array.from(new Set(data.flatMap(item => getAllKeys(item))));

        // Get value from nested object using dot notation
        const getNestedValue = (obj, path) => {
            const parts = path.split('.');
            let current = obj;
            for (const part of parts) {
                if (current === null || current === undefined) return "";
                current = current[part];
            }
            if (current === null || current === undefined) return "";
            if (typeof current === 'object') return JSON.stringify(current);
            return current;
        };

        // Create CSV rows
        const rows = [allKeys.join(delimiter)];
        for (const item of data) {
            const row = allKeys.map(key => {
                const value = getNestedValue(item, key);
                const stringValue = String(value);
                // Escape quotes and wrap in quotes if contains delimiter or quotes
                if (stringValue.includes(delimiter) || stringValue.includes('"') || stringValue.includes('\n')) {
                    return `"${stringValue.replace(/"/g, '""')}"`;
                }
                return stringValue;
            }).join(delimiter);
            rows.push(row);
        }

        return rows.join('\n');
    };

    // Download as CSV
    const downloadAsCSV = () => {
        if (!output) {
            addToast('No JSON data to export', 'error');
            return;
        }

        try {
            const jsonData = JSON.parse(output);
            const csv = jsonToCSV(jsonData, csvDelimiter);
            const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${csvFilename}.csv`;
            a.click();
            URL.revokeObjectURL(url);
            addToast('CSV downloaded successfully', 'success');
        } catch (err) {
            addToast('Failed to convert JSON to CSV', 'error');
        }
    };

    // Copy output to input
    const copyOutputToInput = () => {
        if (output) {
            setInput(output);
            beautifyJson(output);
            addToast('Output copied to input', 'success');
        }
    };

    // Copy output to clipboard
    const copyOutput = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        addToast('Copied to clipboard', 'success');
    };

    // Download as JSON
    const downloadOutput = () => {
        if (!output) return;
        const blob = new Blob([output], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `beautified_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        addToast('JSON downloaded successfully', 'success');
    };

    // Load example data
    const loadExampleData = () => {
        const exampleData = {
            "users": [
                {
                    "id": 1,
                    "name": "John Doe",
                    "email": "john@example.com",
                    "address": {
                        "street": "123 Main St",
                        "city": "New York",
                        "country": "USA"
                    },
                    "hobbies": ["reading", "gaming", "hiking"]
                },
                {
                    "id": 2,
                    "name": "Jane Smith",
                    "email": "jane@example.com",
                    "address": {
                        "street": "456 Oak Ave",
                        "city": "Los Angeles",
                        "country": "USA"
                    },
                    "hobbies": ["photography", "traveling"]
                }
            ],
            "metadata": {
                "total": 2,
                "version": "1.0",
                "generated": new Date().toISOString()
            }
        };
        const jsonString = JSON.stringify(exampleData, null, 2);
        setInput(jsonString);
        beautifyJson(jsonString);
        addToast('Example data loaded', 'info');
    };

    // Clear all data
    const clearAll = () => {
        setInput("");
        setOutput("");
        setError("");
        setUrlInput("");
        addToast('All data cleared', 'info');
    };

    // Apply formatting options
    const applyFormatting = () => {
        if (input.trim()) {
            beautifyJson(input);
            addToast('Formatting applied', 'success');
        }
    };

    return (
        <>
            <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1050 }}>
                {toasts.map(toast => (
                    <Toast key={toast.id} bg={toast.type} autohide>
                        <Toast.Header closeButton={false}>
                            <strong className="me-auto">
                                {toast.type === 'success' && '✓ Success'}
                                {toast.type === 'error' && '✗ Error'}
                                {toast.type === 'info' && 'ℹ Info'}
                            </strong>
                        </Toast.Header>
                        <Toast.Body className={toast.type === 'success' ? 'text-white' : ''}>
                            {toast.message}
                        </Toast.Body>
                    </Toast>
                ))}
            </ToastContainer>

            <div className="container-fluid px-4 py-3">
                {/* Header */}
                <div className="text-center mb-4">
                    <h1 className="display-5 fw-bold bg-gradient bg-primary text-white p-3 rounded-3">
                        <i className="bi bi-braces me-3"></i>
                        JSON Beautifier Pro
                    </h1>
                    <p className="text-muted mt-2">
                        Validate, format, and transform JSON data with advanced CSV export options
                    </p>
                </div>

                {/* Action Bar */}
                <div className="row g-3 mb-4">
                    <div className="col-12">
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <div className="row g-2 align-items-center">
                                    <div className="col-md-auto">
                                        <button className="btn btn-primary" onClick={loadExampleData}>
                                            <i className="bi bi-file-text me-2"></i>Example
                                        </button>
                                    </div>
                                    <div className="col-md-auto">
                                        <button className="btn btn-secondary" onClick={clearAll}>
                                            <i className="bi bi-trash me-2"></i>Clear All
                                        </button>
                                    </div>
                                    <div className="col-md-auto">
                                        <label className="btn btn-outline-primary">
                                            <i className="bi bi-upload me-2"></i>Upload JSON
                                            <input type="file" accept=".json" hidden onChange={handleFileUpload} />
                                        </label>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter API URL..."
                                                value={urlInput}
                                                onChange={(e) => setUrlInput(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && fetchFromUrl()}
                                            />
                                            <button className="btn btn-info" onClick={fetchFromUrl} disabled={isLoading}>
                                                {isLoading ? (
                                                    <span className="spinner-border spinner-border-sm me-2" />
                                                ) : (
                                                    <i className="bi bi-cloud-download me-2" />
                                                )}
                                                Fetch
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="row g-4">
                    {/* Input Section */}
                    <div className="col-lg-6">
                        <div className="card shadow-sm border-0 h-100">
                            <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                                <span className="fw-semibold">
                                    <i className="bi bi-pencil-square me-2"></i>Input JSON
                                </span>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-outline-light btn-sm" onClick={copyOutputToInput} disabled={!output}>
                                        <i className="bi bi-arrow-repeat me-1"></i>Copy Output →
                                    </button>
                                </div>
                            </div>
                            <div className="card-body p-0">
                                <Editor
                                    height="60vh"
                                    defaultLanguage="json"
                                    theme="vs-dark"
                                    value={input}
                                    onChange={handleInputChange}
                                    onMount={(editor) => (editorRef.current = editor)}
                                    options={{
                                        minimap: { enabled: false },
                                        wordWrap: "on",
                                        fontSize: 14,
                                        automaticLayout: true,
                                        scrollBeyondLastLine: false,
                                    }}
                                />
                            </div>
                            {error && (
                                <div className="alert alert-danger m-3 mb-0">
                                    <i className="bi bi-exclamation-triangle me-2"></i>{error}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Output Section */}
                    <div className="col-lg-6">
                        <div className="card shadow-sm border-0 h-100">
                            <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
                                <span className="fw-semibold">
                                    <i className="bi bi-check-circle me-2"></i>Beautified JSON
                                </span>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-outline-light btn-sm" onClick={copyOutput} disabled={!output}>
                                        <i className="bi bi-clipboard-check me-1"></i>Copy
                                    </button>
                                    <button className="btn btn-outline-light btn-sm" onClick={downloadOutput} disabled={!output}>
                                        <i className="bi bi-download me-1"></i>JSON
                                    </button>
                                </div>
                            </div>
                            <div className="card-body p-0">
                                <Editor
                                    height="60vh"
                                    defaultLanguage="json"
                                    theme="vs-dark"
                                    value={output}
                                    options={{
                                        readOnly: true,
                                        minimap: { enabled: false },
                                        wordWrap: "on",
                                        fontSize: 14,
                                        automaticLayout: true,
                                        scrollBeyondLastLine: false,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* CSV Export Section */}
                <div className="row mt-4">
                    <div className="col-12">
                        <div className="card shadow-sm border-0 bg-light">
                            <div className="card-body">
                                <h5 className="card-title mb-3">
                                    <i className="bi bi-file-spreadsheet me-2 text-success"></i>
                                    CSV Export Options
                                </h5>
                                <div className="row g-3 align-items-end">
                                    <div className="col-md-3">
                                        <label className="form-label fw-semibold">Filename</label>
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={csvFilename}
                                                onChange={(e) => setCsvFilename(e.target.value)}
                                                placeholder="export"
                                            />
                                            <span className="input-group-text">.csv</span>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label fw-semibold">Delimiter</label>
                                        <select className="form-select" value={csvDelimiter} onChange={(e) => setCsvDelimiter(e.target.value)}>
                                            <option value=",">Comma (,)</option>
                                            <option value=";">Semicolon (;)</option>
                                            <option value="\t">Tab (\t)</option>
                                            <option value="|">Pipe (|)</option>
                                        </select>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="flattenNested"
                                                checked={flattenNested}
                                                onChange={(e) => setFlattenNested(e.target.checked)}
                                            />
                                            <label className="form-check-label" htmlFor="flattenNested">
                                                Flatten nested objects
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <button className="btn btn-success w-100" onClick={downloadAsCSV} disabled={!output}>
                                            <i className="bi bi-download me-2"></i>Download as CSV
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Advanced Options */}
                <div className="row mt-3">
                    <div className="col-12">
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <h5 className="card-title mb-3">
                                    <i className="bi bi-sliders2 me-2 text-info"></i>
                                    Advanced Formatting
                                </h5>
                                <div className="row g-3 align-items-center">
                                    <div className="col-md-auto">
                                        <div className="btn-group">
                                            <button
                                                className={`btn ${selectedFormat === "beautify" ? "btn-primary" : "btn-outline-primary"}`}
                                                onClick={() => {
                                                    setSelectedFormat("beautify");
                                                    setMinifyOutput(false);
                                                    applyFormatting();
                                                }}
                                            >
                                                <i className="bi bi-braces me-1"></i>Beautify
                                            </button>
                                            <button
                                                className={`btn ${selectedFormat === "minify" ? "btn-primary" : "btn-outline-primary"}`}
                                                onClick={() => {
                                                    setSelectedFormat("minify");
                                                    setMinifyOutput(true);
                                                    applyFormatting();
                                                }}
                                            >
                                                <i className="bi bi-files me-1"></i>Minify
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-md-auto">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="sortKeys"
                                                checked={sortKeys}
                                                onChange={(e) => {
                                                    setSortKeys(e.target.checked);
                                                    applyFormatting();
                                                }}
                                            />
                                            <label className="form-check-label" htmlFor="sortKeys">
                                                Sort keys alphabetically
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-md-auto">
                                        <span className="text-muted">
                                            <i className="bi bi-info-circle me-1"></i>
                                            {output && `${output.length.toLocaleString()} characters`}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
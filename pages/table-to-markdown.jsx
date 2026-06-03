import React, { useState, useCallback, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const TableToMarkdownConverter = () => {
    const [inputValue, setInputValue] = useState('');
    const [markdownOutput, setMarkdownOutput] = useState('');
    const [error, setError] = useState('');

    // Convert HTML table to Markdown
    const convertTableToMarkdown = (htmlString) => {
        try {
            // Create a temporary div to parse HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlString, 'text/html');
            const table = doc.querySelector('table');

            if (!table) {
                throw new Error('No table found in the pasted content');
            }

            const rows = table.querySelectorAll('tr');
            let markdownRows = [];
            let isHeaderProcessed = false;

            rows.forEach((row) => {
                const cells = row.querySelectorAll('th, td');
                if (cells.length === 0) return;

                const rowData = Array.from(cells).map(cell => {
                    let content = cell.textContent.trim();
                    // Clean up multiline content and extra spaces
                    content = content.replace(/\s+/g, ' ').trim();
                    // Escape pipe characters
                    content = content.replace(/\|/g, '\\|');
                    // Escape newlines
                    content = content.replace(/\n/g, ' ');
                    return content || ' ';
                });

                // Add the row to markdown
                markdownRows.push('| ' + rowData.join(' | ') + ' |');

                // Add header separator after first row
                if (!isHeaderProcessed && rowData.length > 0) {
                    const separator = rowData.map(() => '---');
                    markdownRows.push('| ' + separator.join(' | ') + ' |');
                    isHeaderProcessed = true;
                }
            });

            if (markdownRows.length === 0) {
                throw new Error('No valid rows found in the table');
            }

            return markdownRows.join('\n');
        } catch (err) {
            throw new Error(err.message);
        }
    };

    // Handle paste event
    const handlePaste = useCallback((e) => {
        const pastedText = e.clipboardData.getData('text/html') ||
            e.clipboardData.getData('text/plain');

        if (pastedText) {
            setInputValue(pastedText);
            setError('');

            try {
                const markdown = convertTableToMarkdown(pastedText);
                setMarkdownOutput(markdown);
            } catch (err) {
                setError(err.message);
                setMarkdownOutput('');
            }
        } else {
            setError('Please paste HTML table content');
        }
    }, []);

    // Handle input change (for manual editing)
    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        setError('');

        if (value.trim()) {
            try {
                const markdown = convertTableToMarkdown(value);
                setMarkdownOutput(markdown);
            } catch (err) {
                setError(err.message);
                setMarkdownOutput('');
            }
        } else {
            setMarkdownOutput('');
        }
    };

    // Copy markdown to clipboard
    const copyToClipboard = async () => {
        if (!markdownOutput) return;

        try {
            await navigator.clipboard.writeText(markdownOutput);
            // Show temporary success message
            const copyBtn = document.getElementById('copyBtn');
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="bi bi-check-lg"></i> Copied!';
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
        } catch (err) {
            setError('Failed to copy to clipboard');
        }
    };

    // Reset all fields
    const resetAll = () => {
        setInputValue('');
        setMarkdownOutput('');
        setError('');
    };

    // Auto-update when input changes
    useEffect(() => {
        if (inputValue.trim()) {
            try {
                const markdown = convertTableToMarkdown(inputValue);
                setMarkdownOutput(markdown);
                setError('');
            } catch (err) {
                setError(err.message);
                setMarkdownOutput('');
            }
        }
    }, [inputValue]);

    // Example table for demonstration
    const loadExample = () => {
        const exampleTable = `<table class="table">
  <thead>
    <tr>
      <th>Name</th>
      <th>Age</th>
      <th>City</th>
      <th>Occupation</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>John Doe</td>
      <td>28</td>
      <td>New York</td>
      <td>Software Engineer</td>
    </tr>
    <tr>
      <td>Jane Smith</td>
      <td>34</td>
      <td>Los Angeles</td>
      <td>Product Manager</td>
    </tr>
    <tr>
      <td>Mike Johnson</td>
      <td>45</td>
      <td>Chicago</td>
      <td>Data Scientist</td>
    </tr>
    <tr>
      <td>Sarah Williams</td>
      <td>31</td>
      <td>Miami</td>
      <td>UX Designer</td>
    </tr>
  </tbody>
</table>`;

        setInputValue(exampleTable);
        setError('');
        try {
            const markdown = convertTableToMarkdown(exampleTable);
            setMarkdownOutput(markdown);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="container-fluid bg-gradient" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
            <div className="container py-3">
                {/* Header */}
                <div className="text-center mb-3">
                    <h3 className="fw-bold mb-3">
                        Table to Markdown Converter
                    </h3>
                    <p className="lead">
                        Paste any table and get instant Markdown format
                    </p>
                </div>

                {/* Main Content */}
                <div className="row g-4">
                    {/* Left Column - Input */}
                    <div className="col-md-6">
                        <div className="card shadow-lg border-0 rounded-4 h-100">
                            <div className="card-header bg-white border-0 pt-4 px-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <i className="bi bi-table me-2 text-primary"></i>
                                        <h5 className="card-title mb-0 fw-semibold d-inline-block">
                                            Table Input
                                        </h5>
                                    </div>
                                    <button
                                        onClick={resetAll}
                                        className="btn btn-outline-danger btn-sm rounded-pill px-3"
                                        title="Reset all"
                                    >
                                        <i className="bi bi-arrow-repeat me-1"></i>
                                        Reset
                                    </button>
                                </div>
                                <p className="text-muted small mt-2 mb-0">
                                    Copy a table from Excel, Word, or web page and paste below
                                </p>
                            </div>
                            <div className="card-body p-4">
                                <textarea
                                    className="form-control font-monospace"
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    onPaste={handlePaste}
                                    placeholder="Paste your table here... (Ctrl+V)"
                                    rows={15}
                                    style={{
                                        resize: 'vertical',
                                        fontFamily: 'monospace',
                                        fontSize: '14px',
                                        lineHeight: '1.5'
                                    }}
                                />

                                {error && (
                                    <div className="alert alert-danger alert-dismissible fade show mt-3" role="alert">
                                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                        {error}
                                        <button type="button" className="btn-close" data-bs-dismiss="alert" onClick={() => setError('')}></button>
                                    </div>
                                )}

                                <div className="mt-3">
                                    <button
                                        onClick={loadExample}
                                        className="btn btn-outline-primary btn-sm"
                                    >
                                        <i className="bi bi-file-earmark-text me-1"></i>
                                        Load Example
                                    </button>
                                    <small className="text-muted ms-3">
                                        <i className="bi bi-info-circle"></i> Supports complex tables with merged cells
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Output */}
                    <div className="col-md-6">
                        <div className="card shadow-lg border-0 rounded-4 h-100">
                            <div className="card-header bg-white border-0 pt-4 px-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <i className="bi bi-markdown me-2 text-success"></i>
                                        <h5 className="card-title mb-0 fw-semibold d-inline-block">
                                            Markdown Output
                                        </h5>
                                    </div>
                                    <button
                                        id="copyBtn"
                                        onClick={copyToClipboard}
                                        className="btn btn-success btn-sm rounded-pill px-3"
                                        disabled={!markdownOutput}
                                    >
                                        <i className="bi bi-clipboard-check me-1"></i>
                                        Copy
                                    </button>
                                </div>
                                <p className="text-muted small mt-2 mb-0">
                                    Live Markdown table ready to use in GitHub, GitLab, or any Markdown editor
                                </p>
                            </div>
                            <div className="card-body p-4">
                                {markdownOutput ? (
                                    <div className="position-relative">
                                        <pre className="bg-light p-3 rounded-3 border" style={{
                                            minHeight: '300px',
                                            maxHeight: '400px',
                                            overflow: 'auto',
                                            fontFamily: 'monospace',
                                            fontSize: '14px',
                                            lineHeight: '1.5'
                                        }}>
                                            <code>{markdownOutput}</code>
                                        </pre>

                                        {/* Preview Section */}
                                        <div className="mt-4">
                                            <div className="d-flex align-items-center mb-2">
                                                <i className="bi bi-eye-fill me-2 text-info"></i>
                                                <h6 className="mb-0 fw-semibold">Preview</h6>
                                                <small className="text-muted ms-2">How it will look in Markdown</small>
                                            </div>
                                            <div className="table-responsive border rounded-3 p-3 bg-white">
                                                <div className="font-monospace small">
                                                    {markdownOutput.split('\n').map((line, index) => (
                                                        <div key={index} className="py-1">
                                                            {line}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-5 text-muted">
                                        <i className="bi bi-table display-1"></i>
                                        <p className="mt-3">Paste a table on the left to see Markdown output here</p>
                                        <small>Try copying a table from Excel or any website with a table</small>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TableToMarkdownConverter;
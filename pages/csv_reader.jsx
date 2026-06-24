import React, { useState, useCallback, useMemo, useEffect } from 'react';

export default function DataReader() {
    const [allData, setAllData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [displayData, setDisplayData] = useState([]);
    const [fileName, setFileName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(100);
    const [searchTerm, setSearchTerm] = useState('');
    const [visibleColumns, setVisibleColumns] = useState({});
    const [allColumns, setAllColumns] = useState([]);
    const [showColumnSelector, setShowColumnSelector] = useState(false);
    const [goToInput, setGoToInput] = useState('');
    const [exportFormat, setExportFormat] = useState('csv');
    const [exportFileName, setExportFileName] = useState('');

    const parseLargeCSV = useCallback((text) => {
        const lines = text.split('\n').filter(row => row.trim() !== '');
        if (lines.length === 0) return [];

        const headers = lines[0].split(',').map(h => h.trim());
        const data = [];
        for (let i = 1; i < lines.length; i++) {
            const row = lines[i];
            const values = [];
            let current = '';
            let inQuotes = false;

            for (let char of row) {
                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    values.push(current.trim());
                    current = '';
                } else {
                    current += char;
                }
            }
            values.push(current.trim());

            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = values[index] || '';
            });
            data.push(obj);
        }
        return data;
    }, []);

    const applyData = useCallback((parsedData, rpp) => {
        setAllData(parsedData);
        setFilteredData(parsedData);
        if (parsedData.length > 0) {
            const columns = Object.keys(parsedData[0]);
            setAllColumns(columns);
            const initialVisibility = {};
            columns.forEach(col => { initialVisibility[col] = true; });
            setVisibleColumns(initialVisibility);
        }
        setTotalPages(rpp === 'all' ? 1 : Math.ceil(parsedData.length / rpp));
        setDisplayData(rpp === 'all' ? parsedData : parsedData.slice(0, rpp));
        setLoading(false);
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFileName(file.name);
        setExportFileName(file.name.replace(/\.[^/.]+$/, ''));
        setError('');
        setAllData([]);
        setFilteredData([]);
        setDisplayData([]);
        setCurrentPage(1);
        setSearchTerm('');
        setShowColumnSelector(false);
        setLoading(true);

        const fileExtension = file.name.split('.').pop().toLowerCase();

        if (!['csv', 'xlsx', 'xls'].includes(fileExtension)) {
            setError('Please upload a CSV or Excel file (.csv, .xlsx, .xls)');
            setLoading(false);
            e.target.value = '';
            return;
        }

        const reader = new FileReader();

        if (fileExtension === 'csv') {
            reader.onload = (event) => {
                try {
                    const parsedData = parseLargeCSV(event.target.result);
                    applyData(parsedData, rowsPerPage);
                } catch (err) {
                    setError('Error parsing CSV file: ' + err.message);
                    setLoading(false);
                }
            };
            reader.onerror = () => { setError('Error reading file'); setLoading(false); };
            reader.readAsText(file);
        } else {
            reader.onload = async (event) => {
                try {
                    const XLSX = await import('xlsx');
                    const data = new Uint8Array(event.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                    const parsedData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
                    applyData(parsedData, rowsPerPage);
                } catch (err) {
                    setError('Error parsing Excel file: ' + err.message);
                    setLoading(false);
                }
            };
            reader.onerror = () => { setError('Error reading file'); setLoading(false); };
            reader.readAsArrayBuffer(file);
        }

        e.target.value = '';
    };

    useEffect(() => {
        if (allData.length === 0) return;
        let filtered = allData;
        if (searchTerm.trim() !== '') {
            const term = searchTerm.toLowerCase().trim();
            filtered = allData.filter(row =>
                Object.values(row).some(value => String(value).toLowerCase().includes(term))
            );
        }
        setFilteredData(filtered);
        setTotalPages(rowsPerPage === 'all' ? 1 : Math.ceil(filtered.length / rowsPerPage));
        setCurrentPage(1);
        setDisplayData(rowsPerPage === 'all' ? filtered : filtered.slice(0, rowsPerPage));
    }, [searchTerm, allData, rowsPerPage]);

    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        const start = (page - 1) * rowsPerPage;
        setDisplayData(filteredData.slice(start, start + rowsPerPage));
    };

    const handleRowsPerPageChange = (e) => {
        const val = e.target.value;
        const newRowsPerPage = val === 'all' ? 'all' : parseInt(val);
        setRowsPerPage(newRowsPerPage);
        setTotalPages(newRowsPerPage === 'all' ? 1 : Math.ceil(filteredData.length / newRowsPerPage));
        setCurrentPage(1);
        setDisplayData(newRowsPerPage === 'all' ? filteredData : filteredData.slice(0, newRowsPerPage));
    };

    const handleGoToPage = () => {
        const page = parseInt(goToInput);
        if (!isNaN(page)) goToPage(page);
        setGoToInput('');
    };

    const toggleColumn = (column) => {
        setVisibleColumns(prev => ({ ...prev, [column]: !prev[column] }));
    };

    const toggleAllColumns = () => {
        const allVisible = allColumns.every(col => visibleColumns[col]);
        const newVisibility = {};
        allColumns.forEach(col => { newVisibility[col] = !allVisible; });
        setVisibleColumns(newVisibility);
    };

    const handleClear = () => {
        setAllData([]);
        setFilteredData([]);
        setDisplayData([]);
        setFileName('');
        setError('');
        setCurrentPage(1);
        setTotalPages(1);
        setSearchTerm('');
        setVisibleColumns({});
        setAllColumns([]);
        setShowColumnSelector(false);
        setExportFileName('');
    };

    const downloadBlob = (blob, name) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleExport = async () => {
        if (!filteredData.length) return;
        const cols = getVisibleColumns;
        const rows = filteredData.map(row => {
            const obj = {};
            cols.forEach(col => { obj[col] = row[col] ?? ''; });
            return obj;
        });
        const name = (exportFileName.trim() || fileName.replace(/\.[^/.]+$/, '') || 'export');

        if (exportFormat === 'csv' || exportFormat === 'tsv') {
            const sep = exportFormat === 'tsv' ? '\t' : ',';
            const escape = (val) => {
                const s = String(val);
                return exportFormat === 'csv' && (s.includes(',') || s.includes('"') || s.includes('\n'))
                    ? `"${s.replace(/"/g, '""')}"` : s;
            };
            const lines = [
                cols.map(escape).join(sep),
                ...rows.map(row => cols.map(col => escape(row[col])).join(sep))
            ].join('\n');
            const mime = exportFormat === 'tsv' ? 'text/tab-separated-values' : 'text/csv';
            downloadBlob(new Blob([lines], { type: mime }), `${name}.${exportFormat}`);
        } else if (exportFormat === 'json') {
            downloadBlob(new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' }), `${name}.json`);
        } else if (exportFormat === 'xlsx' || exportFormat === 'xls') {
            const XLSX = await import('xlsx');
            const ws = XLSX.utils.json_to_sheet(rows, { header: cols });
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
            XLSX.writeFile(wb, `${name}.${exportFormat}`);
        } else if (exportFormat === 'html') {
            const tableRows = rows.map(row =>
                `<tr>${cols.map(col => `<td>${String(row[col]).replace(/</g, '&lt;')}</td>`).join('')}</tr>`
            ).join('');
            const html = `<html><head><meta charset="utf-8"></head><body><table border="1"><thead><tr>${cols.map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody>${tableRows}</tbody></table></body></html>`;
            downloadBlob(new Blob([html], { type: 'text/html' }), `${name}.html`);
        }
    };

    const getPageNumbers = () => {
        const maxPagesToShow = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
        if (endPage - startPage < maxPagesToShow - 1) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }
        const pages = [];
        for (let i = startPage; i <= endPage; i++) pages.push(i);
        return pages;
    };

    const getVisibleColumns = useMemo(() => {
        return allColumns.filter(col => visibleColumns[col]);
    }, [allColumns, visibleColumns]);

    return (
        <div className="container my-5">
            <div className="card shadow-lg border-0">
                <div className="card-header bg-success text-white py-3">
                    <h5 className="mb-0">
                        <i className="bi bi-filetype-csv me-2"></i>
                        CSV / Excel File Reader
                    </h5>
                </div>
                <div className="card-body">

                    {/* Row 1: Upload + Clear */}
                    <div className="d-flex gap-2 align-items-center">
                        <div className="input-group flex-grow-1">
                            <label className="input-group-text" htmlFor="fileInput">
                                <i className="bi bi-upload"></i>
                            </label>
                            <input
                                type="file"
                                className="form-control"
                                id="fileInput"
                                accept=".csv,.xlsx,.xls"
                                onChange={handleFileChange}
                                disabled={loading}
                            />
                        </div>
                        <button
                            className="btn btn-outline-danger flex-shrink-0"
                            onClick={handleClear}
                            disabled={(!allData.length && !fileName) || loading}
                        >
                            <i className="bi bi-trash me-1"></i> Clear
                        </button>




                    </div>




                    {fileName && (
                        <div className="mt-1 text-muted small">
                            <i className="bi bi-file-earmark me-1"></i>{fileName}
                        </div>
                    )}

                    {/* Loading */}
                    {loading && (
                        <div className="text-center my-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-2 text-muted">Processing file...</p>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="alert alert-danger mt-3" role="alert">
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                            {error}
                        </div>
                    )}

                    {/* Row 2: Search + Rows per page + Columns (visible when data loaded) */}
                    {allData.length > 0 && !loading && (
                        <div className="d-flex gap-2 align-items-center mt-3">
                            <div className="input-group flex-grow-1">
                                <span className="input-group-text">
                                    <i className="bi bi-search"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search across all columns..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                {searchTerm && (
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={() => setSearchTerm('')}
                                        type="button"
                                    >
                                        <i className="bi bi-x"></i>
                                    </button>
                                )}
                            </div>
                            <select
                                className="form-select flex-shrink-0"
                                style={{ width: '175px' }}
                                value={rowsPerPage}
                                onChange={handleRowsPerPageChange}
                            >
                                <option value={20}>20 rows / page</option>
                                <option value={50}>50 rows / page</option>
                                <option value={100}>100 rows / page</option>
                                <option value={500}>500 rows / page</option>
                                <option value={1000}>1000 rows / page</option>
                                <option value="all">Show All</option>
                            </select>
                            <button
                                className="btn btn-outline-primary flex-shrink-0"
                                onClick={() => setShowColumnSelector(!showColumnSelector)}
                                type="button"
                            >
                                <i className="bi bi-table me-1"></i>
                                Columns
                                <span className="badge bg-primary ms-1">
                                    {getVisibleColumns.length}/{allColumns.length}
                                </span>
                            </button>



                            {/* Export */}
                            {filteredData.length > 0 && !loading && (
                                < >
                                    <div className="input-group flex-grow-1">
                                        <span className="input-group-text">
                                            <i className="bi bi-download"></i>
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Export file name..."
                                            value={exportFileName}
                                            onChange={(e) => setExportFileName(e.target.value)}
                                        />
                                        <span className="input-group-text text-muted">.{exportFormat}</span>
                                    </div>
                                    <select
                                        className="form-select flex-shrink-0"
                                        style={{ width: '105px' }}
                                        value={exportFormat}
                                        onChange={(e) => setExportFormat(e.target.value)}
                                    >
                                        <option value="csv">CSV</option>
                                        <option value="tsv">TSV</option>
                                        <option value="xlsx">XLSX</option>
                                        <option value="xls">XLS</option>
                                        <option value="json">JSON</option>
                                        <option value="html">HTML</option>
                                    </select>
                                    <button
                                        className="btn btn-success flex-shrink-0"
                                        onClick={handleExport}
                                    >
                                        <i className="bi bi-download me-1"></i>
                                        Export ({filteredData.length.toLocaleString()})
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                    {searchTerm && allData.length > 0 && (
                        <div className="text-muted small mt-1">
                            Found {filteredData.length.toLocaleString()} matching records
                        </div>
                    )}

                    {/* Column Selector */}
                    {showColumnSelector && allColumns.length > 0 && !loading && (
                        <div className="card mt-3 border-primary">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h6 className="mb-0">
                                        <i className="bi bi-layers me-1"></i>
                                        Select Columns to Display
                                    </h6>
                                    <button
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={toggleAllColumns}
                                    >
                                        {allColumns.every(col => visibleColumns[col]) ? 'Hide All' : 'Show All'}
                                    </button>
                                </div>
                                <div className="d-flex flex-wrap gap-2">
                                    {allColumns.map((column, idx) => (
                                        <div key={idx} className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={`col-${idx}`}
                                                checked={visibleColumns[column] !== false}
                                                onChange={() => toggleColumn(column)}
                                            />
                                            <label className="form-check-label" htmlFor={`col-${idx}`}>
                                                {column}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Record Count */}
                    {filteredData.length > 0 && !loading && (
                        <div className="alert alert-success mt-3" role="alert">
                            <i className="bi bi-check-circle-fill me-2"></i>
                            Loaded <strong>{allData.length.toLocaleString()}</strong> record(s)
                            {searchTerm && ` (${filteredData.length.toLocaleString()} matched)`}
                            {rowsPerPage !== 'all' && filteredData.length > rowsPerPage && (
                                <span className="ms-2">
                                    · Showing rows {(currentPage - 1) * rowsPerPage + 1}–
                                    {Math.min(currentPage * rowsPerPage, filteredData.length)} of {filteredData.length.toLocaleString()}
                                </span>
                            )}
                        </div>
                    )}



                    {/* Data Table */}
                    {displayData.length > 0 && !loading && getVisibleColumns.length > 0 && (
                        <>
                            <div className="table-responsive mt-4" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                                <table
                                    className="table table-striped table-hover table-bordered table-sm"
                                    style={{ fontSize: '0.82rem' }}
                                >
                                    <thead className="table-dark sticky-top">
                                        <tr>
                                            <th style={{ width: '55px' }}>#</th>
                                            {getVisibleColumns.map((key, idx) => (
                                                <th key={idx}>{key}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {displayData.map((row, rowIndex) => {
                                            const globalIndex = rowsPerPage === 'all' ? rowIndex + 1 : (currentPage - 1) * rowsPerPage + rowIndex + 1;
                                            return (
                                                <tr key={globalIndex}>
                                                    <td>{globalIndex}</td>
                                                    {getVisibleColumns.map((key, colIndex) => (
                                                        <td key={colIndex}>{row[key]}</td>
                                                    ))}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
                                    <div className="text-muted small">
                                        Page {currentPage} of {totalPages}
                                    </div>

                                    <nav aria-label="Page navigation">
                                        <ul className="pagination mb-0">
                                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                <button className="page-link" onClick={() => goToPage(1)}>
                                                    <i className="bi bi-chevron-double-left"></i>
                                                </button>
                                            </li>
                                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                <button className="page-link" onClick={() => goToPage(currentPage - 1)}>
                                                    <i className="bi bi-chevron-left"></i>
                                                </button>
                                            </li>
                                            {getPageNumbers().map(page => (
                                                <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                                                    <button className="page-link" onClick={() => goToPage(page)}>
                                                        {page}
                                                    </button>
                                                </li>
                                            ))}
                                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                <button className="page-link" onClick={() => goToPage(currentPage + 1)}>
                                                    <i className="bi bi-chevron-right"></i>
                                                </button>
                                            </li>
                                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                <button className="page-link" onClick={() => goToPage(totalPages)}>
                                                    <i className="bi bi-chevron-double-right"></i>
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>

                                    {/* Go to page */}
                                    <div className="d-flex align-items-center gap-2">
                                        <span className="text-muted small text-nowrap">Go to page:</span>
                                        <input
                                            type="number"
                                            className="form-control form-control-sm"
                                            style={{ width: '70px' }}
                                            value={goToInput}
                                            min={1}
                                            max={totalPages}
                                            placeholder="#"
                                            onChange={(e) => setGoToInput(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === 'Enter') handleGoToPage(); }}
                                        />
                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={handleGoToPage}
                                        >
                                            Go
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* No Results */}
                    {searchTerm && filteredData.length === 0 && !loading && allData.length > 0 && (
                        <div className="text-center py-4">
                            <i className="bi bi-search" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
                            <h5 className="mt-3 text-secondary">No results found</h5>
                            <p className="text-muted">Try adjusting your search terms</p>
                        </div>
                    )}

                    {/* Empty State */}
                    {!allData.length && !error && !fileName && !loading && (
                        <div className="text-center py-5">
                            <i className="bi bi-file-earmark-spreadsheet" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
                            <h5 className="mt-3 text-secondary">No data loaded</h5>
                            <p className="text-muted">Upload a CSV or Excel file (.csv, .xlsx, .xls) to view its contents</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

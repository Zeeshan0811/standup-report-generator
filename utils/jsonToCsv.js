export const convertJsonToCsv = (jsonData) => {
    if (!jsonData || jsonData.length === 0) {
        return '';
    }

    // Get headers from first object
    const headers = Object.keys(jsonData[0]);

    // Create CSV rows
    const csvRows = [];

    // Add headers
    csvRows.push(headers.join(','));

    // Add data rows
    for (const row of jsonData) {
        const values = headers.map(header => {
            const value = row[header];
            // Handle different data types
            if (value === null || value === undefined) {
                return '';
            }
            if (typeof value === 'object') {
                return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
            }
            // Escape quotes and wrap in quotes if contains comma
            const stringValue = String(value);
            if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
        });
        csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
};

export const downloadCsv = (csvContent, filename = 'data.csv') => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
};
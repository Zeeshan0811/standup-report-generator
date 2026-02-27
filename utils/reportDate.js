export function reportDate() {
    const today = new Date();

    const reportDate = today.toISOString().split('T')[0];
    const formattedDate = reportDate.split("-").reverse().join("/"); // Convert YYYY-MM-DD to DD/MM/YYYY

    return formattedDate;
}
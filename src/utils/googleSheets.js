const API_KEY = 'AIzaSyCSi5joMtjJ311Gpl4JbMld7DFAF8Ql6dU';
const SPREADSHEET_ID = '1fGts8AYKH63Cj9Yznle8zEMtv7aEWZ7Ofk24CAdlgtw';

/**
 * Converts common share links (Drive, OneDrive) to direct image source URLs
 */
export const formatDriveUrl = (url) => {
    if (!url) return url;

    // Google Drive — use lh3.googleusercontent.com which bypasses CORS blocking
    if (url.includes('drive.google.com')) {
        // Extract the file ID from any Google Drive URL format:
        //   /file/d/FILE_ID/view
        //   ?id=FILE_ID
        //   /open?id=FILE_ID
        const idMatch =
            url.match(/\/d\/([a-zA-Z0-9_-]{10,})/) ||
            url.match(/id=([a-zA-Z0-9_-]{10,})/);
        if (idMatch && idMatch[1]) {
            // This format works reliably for public Google Drive images
            return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
        }
    }

    // OneDrive
    if (url.includes('1drv.ms') || url.includes('onedrive.live.com')) {
        return url.replace('?usp=sharing', '').replace('?e=', '&download=1&e=');
    }

    return url;
};

/**
 * Fetches data from a specific tab in the Google Sheet
 */
export const fetchSheetData = async (tabName) => {
    try {
        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${tabName}!A:Z?key=${API_KEY}`
        );
        const data = await response.json();

        if (!data.values || data.values.length < 2) return [];

        const [headers, ...rows] = data.values;

        return rows.map((row, i) => {
            const obj = {};
            headers.forEach((header, index) => {
                let value = row[index] || '';
                if (header.toLowerCase().includes('url') || header.toLowerCase() === 'url') {
                    value = formatDriveUrl(value);
                }
                obj[header] = value;
            });

            // Fallback for missing spans
            if (!obj.Span && !obj.span) {
                obj.Span = 'col-span-1 row-span-1';
            }

            return obj;
        });
    } catch (error) {
        console.error(`Error fetching sheet data for ${tabName}:`, error);
        return [];
    }
};

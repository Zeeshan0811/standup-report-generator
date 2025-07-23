import fs from 'fs';
import path from 'path';

const filePath = path.resolve(process.cwd(), 'data/report-count.json'); // or 'data/report-count.json'

export default async function handler(req, res) {
    try {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify({ count: 0 }));
        }

        const jsonData = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(jsonData);

        if (req.method === 'POST') {
            data.count += 1;
            fs.writeFileSync(filePath, JSON.stringify(data));
            return res.status(200).json({ success: true, count: data.count });
        }

        return res.status(200).json({ success: true, count: data.count });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

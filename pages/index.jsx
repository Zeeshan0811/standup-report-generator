
import { useState } from 'react';
import { parseMarkdownReport } from '../utils/parseMarkdownReport';
import { parseRawReport } from '../utils/parseRawReport';

export default function Home() {
  const [input, setInput] = useState('');
  // const [date, setDate] = useState('');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [view, setView] = useState('markdown');
  const [rawOutput, setRawOutput] = useState('');
  const [markdownOutput, setMarkdownOutput] = useState('');

  const handleGenerate = () => {
    const raw = parseRawReport(input, date);
    const markdown = parseMarkdownReport(input, date);
    setRawOutput(raw);
    setMarkdownOutput(markdown);
  };

  const copyToClipboard = () => {
    const text = view === 'markdown' ? markdownOutput : rawOutput;
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  };

  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
      <h1>Stand Up Report Generator</h1>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={{ display: 'block', marginBottom: '1rem' }}
      />
      <textarea
        rows="10"
        style={{ width: '100%', padding: '1rem' }}
        placeholder="Paste raw Slack messages here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleGenerate} style={{ marginTop: '1rem' }}>Generate Report</button>

      {markdownOutput && rawOutput && (
        <>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button onClick={() => setView('raw')} style={{ backgroundColor: view === 'raw' ? '#0070f3' : '#ccc' }}>Raw View</button>
            <button onClick={() => setView('markdown')} style={{ backgroundColor: view === 'markdown' ? '#0070f3' : '#ccc' }}>Markdown View</button>
            <button onClick={copyToClipboard} style={{ marginLeft: 'auto', backgroundColor: '#22c55e' }}>📋 Copy</button>
          </div>
          <pre style={{ backgroundColor: '#f3f3f3', padding: '1rem', marginTop: '1rem', whiteSpace: 'pre-wrap' }}>
            {view === 'markdown' ? markdownOutput : rawOutput}
          </pre>
        </>
      )}
    </main>
  );
}

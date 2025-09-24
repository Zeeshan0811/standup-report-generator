import Head from 'next/head';
import { useState, useEffect } from 'react';
import { parseMarkdownReport } from '../utils/parseMarkdownReport';
import { parseRawReport } from '../utils/parseRawReport';

const StandUpReportGenerator = () => {
    const [input, setInput] = useState('');
    const [reportCount, setReportCount] = useState(0);
    const [nameOrder, setNameOrder] = useState([]);
    const [userNoDataList, setUserNoDataList] = useState([]);
    const [reloadFlag, setReloadFlag] = useState(false);
    const [copied, setCopied] = useState({ raw: false, markdown: false });
    const [date, setDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });
    const [view, setView] = useState('markdown');
    const [rawOutput, setRawOutput] = useState('');
    const [markdownOutput, setMarkdownOutput] = useState('');

    const handleGenerate = async () => {
        const raw = parseRawReport(input, date);
        // const markdown = parseMarkdownReport(input, date);
        const { nameOrder, markdown, userNoData } = parseMarkdownReport(input, date);
        setRawOutput(raw);
        setNameOrder(nameOrder);
        setMarkdownOutput(markdown);
        setUserNoDataList(userNoData);

        // Call backend to increment
        // try {
        //   await fetch('/api/increment', {
        //     method: 'POST',
        //   });
        //   setReloadFlag((prev) => !prev);
        // } catch (err) {
        //   console.error('Failed to increment report count:', err);
        // }
    };

    // useEffect(() => {
    //   fetch('/api/increment')
    //     .then((res) => res.json())
    //     .then((data) => setReportCount(data.count))
    //     .catch((err) => console.error('Failed to load count:', err));
    // }, [reloadFlag]);

    // const copyToClipboard = () => {
    //     const text = view === 'markdown' ? markdownOutput : rawOutput;
    //     navigator.clipboard.writeText(text).then(() => {
    //         alert('Copied to clipboard!');
    //     });
    // };

    useEffect(() => {
        handleGenerate();
    }, [input, date]);

    const handleCopy = async (textType) => {
        const text = textType === 'markdown' ? markdownOutput : rawOutput;
        try {
            await navigator.clipboard.writeText(text);
            setCopied((prev) => ({ ...prev, [textType]: true }));
            setTimeout(() => {
                setCopied((prev) => ({ ...prev, [textType]: false }));
            }, 2000); // Reset after 2 seconds
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };


    return (
        <>
            <Head>
                <title>Stand Up Report Generator</title>
            </Head>
            {/* <div className="container">
            </div> */}
            <h2 className="mb-4">Stand Up Report Generator</h2>
            <div className="row">
                {/* Input Section */}
                <div className="col-md-2 mb-4">
                    <div className="list-group shadow-sm rounded">
                        {nameOrder.map((item, index) => {
                            const found = userNoDataList.includes(item);
                            return (
                                <div
                                    key={index}
                                    className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                                >
                                    <span className="text-success fw-semibold">{item}</span>
                                    {input && (
                                        found
                                            ? <i className="bi bi-x-circle-fill text-danger"></i>
                                            : <i className="bi bi-check-circle-fill text-success"></i>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="col-md-5 mb-4">
                    <div className="mb-3">
                        <label className="form-label">Select Date</label>
                        <input
                            type="date"
                            className="form-control"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Raw Slack Messages</label>
                        <textarea
                            className="form-control"
                            rows="10"
                            placeholder="Paste raw Slack messages here..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        ></textarea>


                        {/* {userNoDataList.map((item, index) => (
                                <p key={index} className='text-danger'>{item}</p>
                            ))} */}
                    </div>
                    {/* <button className="btn btn-primary w-100" onClick={handleGenerate}>
                            Generate Report
                        </button> */}
                </div>

                {/* Output Section */}
                <div className="col-md-5">
                    {markdownOutput && rawOutput && (
                        <>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <div>
                                    <button
                                        className={`me-2 btn ${view === 'markdown' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                                        onClick={() => setView('markdown')}
                                    >
                                        Markdown View
                                    </button>
                                    {/* <button class="btn btn-info text-white ">Total Report Generated: {reportCount}</button> */}
                                    {/* <button
                    className={`btn me-2 ${view === 'raw' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                    onClick={() => setView('raw')}
                  >
                    Raw View
                  </button> */}

                                </div>

                                {/* <button className="btn btn-success" onClick={copyToClipboard}>
                                        📋 Copy
                                    </button> */}

                                {input && userNoDataList.length > 0 ? <button className="btn btn-danger text-white">Missing Report Count: {userNoDataList.length}</button> : null}


                                <button
                                    className={`btn btn-sm ${copied.markdown ? "btn-success" : "btn-secondary"
                                        }`}
                                    onClick={() => handleCopy("markdown")}
                                >
                                    📋 {copied.markdown ? "Copied!" : "Copy"}
                                </button>
                            </div>
                            <textarea
                                className="form-control mb-3"
                                rows="13"
                                readonly
                                value={view === 'markdown' ? markdownOutput : rawOutput}
                                style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f8f9fa' }} >
                            </textarea>
                            <p style={{ fontStyle: 'italic', marginTop: '0.5rem', color: '#888' }}>
                                💡 Use <strong>CTRL + SHIFT + F</strong> in Slack to format code blocks properly after pasting.
                            </p>

                        </>
                    )}
                </div>
            </div>


        </>
    );
}


export default StandUpReportGenerator;
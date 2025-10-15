'use-client'
import React, { useState, useEffect } from 'react'
import Editor from "@monaco-editor/react";

const json_beautifier = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');


    const handleBeautify = () => {
        if (!input.trim()) {
            setOutput("");
            setError("");
            return;
        }

        try {
            const parsed = JSON.parse(input);
            const pretty = JSON.stringify(parsed, null, 2);
            setOutput(pretty);
            setError('');
        } catch (err) {
            setError('❌ Invalid JSON: ' + err.message);
            setOutput('');
        }
    };

    useEffect(() => {
        console.log("Input changed:", Math.floor(Date.now() / 1000));
        const timeout = setTimeout(() => {
            handleBeautify();
        }, 3000);
        return () => clearTimeout(timeout);
    }, [input]);


    const handleCopy = async () => {
        if (output) {
            await navigator.clipboard.writeText(output);
            alert('Beautified JSON copied to clipboard!');
        }
    };

    const handleClear = () => {
        setInput('');
        setOutput('');
        setError('');
    };

    // Download JSON
    const handleDownload = () => {
        if (!output) return;
        const blob = new Blob([output], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = "beautified_" + Math.floor(Date.now() / 1000) + ".json";
        link.click();
    };

    const handlePaste = (e) => {
        const text = e.clipboardData.getData("text");
        setInput(text); // Immediately update input state
        handleBeautify(text); // Beautify pasted content immediately
        e.preventDefault(); // Optional: prevent default paste if using plain editor
    };

    return (
        <>
            <div className="text-center mb-5">
                <h2 className="fw-bold">
                    <i className="bi bi-braces text-info me-2"></i>
                    JSON Beautifier
                </h2>
                <p className="text-muted mb-0">
                    Paste raw JSON, validate, and format it instantly.
                </p>
            </div>

            <div className="row g-4">
                {/* Input Area */}
                <div className="col-lg-6">
                    <div className="card h-100 border-0 shadow-sm">
                        <div className="card-header bg-light fw-semibold">Input JSON</div>
                        <div className="card-body">
                            <Editor
                                height="100%"
                                defaultLanguage="json"
                                theme="vs-light"
                                value={input}
                                onChange={(val) => setInput(val || "")}
                                onPaste={handlePaste}
                                options={{
                                    minimap: { enabled: false },
                                    wordWrap: "on",
                                    fontSize: 14,
                                    automaticLayout: true,
                                }}
                            />
                        </div>
                        <div className="card-footer bg-white d-flex justify-content-between">
                            <button
                                className="btn btn-outline-info"
                                onClick={handleBeautify}
                            >
                                <i className="bi bi-magic me-1"></i> Beautify
                            </button>
                            <button
                                className="btn btn-outline-primary d-flex align-items-center"
                                onClick={() => {
                                    if (output) {
                                        setInput(output);
                                        setError("");
                                    }
                                }}
                                disabled={!output}
                            >
                                <i className="bi bi-arrow-repeat me-2"></i> Copy Output to Input
                            </button>
                            <button className="btn btn-outline-secondary" onClick={handleClear}>
                                <i className="bi bi-x-circle me-1"></i> Clear
                            </button>
                        </div>
                    </div>
                </div>

                {/* Output Area */}
                <div className="col-lg-6">
                    <div className="card h-100 border-0 shadow-sm">
                        <div className="card-header bg-light fw-semibold">Beautified JSON</div>
                        <div className="card-body bg-light p-3 overflow-auto" style={{ minHeight: '300px' }}   >
                            {error ? (
                                <div className="alert alert-danger py-2 mb-0">{error}</div>
                            ) : (
                                <Editor
                                    height="50vh"
                                    defaultLanguage="json"
                                    theme="vs-light"
                                    value={input}
                                    onChange={(val) => setInput(val || "")}
                                    options={{
                                        minimap: { enabled: false },
                                        wordWrap: "on",
                                        fontSize: 14,
                                        automaticLayout: true,
                                    }}
                                />
                            )}
                        </div>
                        <div className="card-footer bg-light d-flex justify-content-between align-items-center rounded-bottom shadow-sm">
                            <span className="text-muted small fst-italic">
                                Output actions
                            </span>

                            <div className="d-flex gap-2">
                                <button
                                    onClick={handleCopy}
                                    className="btn btn-outline-success d-flex align-items-center"
                                    disabled={!output}
                                >
                                    <i className="bi bi-clipboard-check me-2"></i> Copy
                                </button>

                                <button
                                    onClick={handleDownload}
                                    className="btn btn-primary d-flex align-items-center"
                                    disabled={!output}
                                >
                                    <i className="bi bi-download me-2"></i> Download
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default json_beautifier
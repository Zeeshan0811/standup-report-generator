'use client';
import { useState, useRef } from "react";
import Editor, { OnChange } from "@monaco-editor/react";

export default function JsonBeautifier() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [error, setError] = useState("");

    const editorRef = useRef(null);

    // 🧩 Beautify JSON immediately
    const beautifyJson = (value) => {
        if (!value.trim()) {
            setOutput("");
            setError("");
            return;
        }

        try {
            const parsed = JSON.parse(value);
            const formatted = JSON.stringify(parsed, null, 2);
            setOutput(formatted);
            setError("");
        } catch {
            setOutput("");
            setError("⚠️ Invalid JSON syntax");
        }
    };

    // 🔹 Handle editor changes (typing)
    const handleInputChange = (value) => {
        const val = value || "";
        setInput(val);
        beautifyJson(val);
    };

    // 🔹 Copy output to input
    const copyOutputToInput = () => {
        if (output) {
            setInput(output);
            beautifyJson(output);
        }
    };

    // 🔹 Copy output to clipboard
    const copyOutput = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
    };

    // 🔹 Download output as JSON file
    const downloadOutput = () => {
        if (!output) return;
        const blob = new Blob([output], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "beautified.json";
        a.click();
        URL.revokeObjectURL(url);
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
                {/* Input JSON */}
                <div className="col-md-6">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                            <span className="fw-semibold">Input JSON</span>
                            <div className="d-flex gap-2">
                                <button
                                    className="btn btn-outline-light btn-sm d-flex align-items-center"
                                    onClick={copyOutputToInput}
                                    disabled={!output}
                                >
                                    <i className="bi bi-arrow-repeat me-1"></i> Copy Output → Input
                                </button>
                            </div>
                        </div>

                        <div style={{ minHeight: "300px" }}>
                            <Editor
                                height="50vh"
                                defaultLanguage="json"
                                theme="vs-light"
                                value={input}
                                onChange={handleInputChange}
                                onMount={(editor) => (editorRef.current = editor)}
                                options={{
                                    minimap: { enabled: false },
                                    wordWrap: "on",
                                    fontSize: 14,
                                    automaticLayout: true,
                                }}
                            />
                        </div>

                        {error && <p className="text-danger small m-2">{error}</p>}
                    </div>
                </div>

                {/* Output JSON */}
                <div className="col-md-6">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-header bg-success text-white fw-semibold  d-flex justify-content-between align-items-center">
                            <span>Beautified JSON</span>

                            <div className="d-flex gap-2">
                                <button
                                    className="btn btn-outline-light btn-sm d-flex align-items-center"
                                    onClick={copyOutput}
                                    disabled={!output}
                                >
                                    <i className="bi bi-clipboard-check me-1"></i> Copy Output
                                </button>
                                <button
                                    className="btn btn-light btn-sm d-flex align-items-center text-dark"
                                    onClick={downloadOutput}
                                    disabled={!output}
                                >
                                    <i className="bi bi-download me-1"></i> Download
                                </button>
                            </div>
                        </div>
                        <div style={{ minHeight: "300px" }}>
                            <Editor
                                height="50vh"
                                defaultLanguage="json"
                                theme="vs-light"
                                value={output}
                                options={{
                                    readOnly: true,
                                    minimap: { enabled: false },
                                    wordWrap: "on",
                                    fontSize: 14,
                                    automaticLayout: true,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

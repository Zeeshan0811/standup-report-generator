"use client";
import React, { useEffect, useRef, useState } from "react";
import Head from 'next/head';

const DailyReportGenerator = () => {
    const [date, setDate] = useState("");
    const [employeeName, setEmployeeName] = useState("");
    const [tasks, setTasks] = useState("");
    const [copied, setCopied] = useState({ today: false, report: false });
    const tasksRef = useRef(null);

    // Load from localStorage on mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedName = localStorage.getItem("employeeName") || "";
            const savedTasks = localStorage.getItem("tasks") || "";

            console.log("Loaded from localStorage:", { savedName, savedTasks });

            const today = new Date().toISOString().split("T")[0];
            setDate(today);
            setEmployeeName(savedName);
            setTasks(savedTasks);
        }
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (typeof window !== "undefined") {
                localStorage.setItem("employeeName", employeeName);
                localStorage.setItem("tasks", tasks);
            }
        }, 500); // Save after 500ms of inactivity
        return () => clearTimeout(timeout);
    }, [employeeName, tasks]);

    const todayTaskOutput = `Today's Task\n${formatDate(date)}\n\`\`\`\n${tasks.trim()}\n\`\`\``;

    const dailyReportOutput = `Daily Report of\n${employeeName.trim()}\n${formatDate(date)}\n\`\`\`\n${tasks.trim()}\n\`\`\``;

    function formatDate(isoDate) {
        const [year, month, day] = isoDate.split("-");
        return `${day}-${month}-${year}`;
    }

    const insertArrowLine = () => {
        const textarea = tasksRef.current;
        const start = textarea ? textarea.selectionStart : tasks.length;
        const end = textarea ? textarea.selectionEnd : tasks.length;
        const insertion = start === 0 ? "→ " : "\n→ ";
        const newValue = tasks.slice(0, start) + insertion + tasks.slice(end);
        setTasks(newValue);
        const cursorPos = start + insertion.length;
        requestAnimationFrame(() => {
            if (!textarea) return;
            textarea.focus();
            textarea.selectionStart = textarea.selectionEnd = cursorPos;
        });
    };

    const handleTasksKeyDown = (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            e.preventDefault();
            insertArrowLine();
        }
    };

    const handleCopy = async (textType) => {
        const text = textType === "today" ? todayTaskOutput : dailyReportOutput;
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
                <title>Daily Report Generator</title>
            </Head>
            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-6 mb-4">
                        <h3 className="mb-4">Today's Task & Daily Report Generator</h3>
                        <div className="mb-3">
                            <label className="form-label">Date</label>
                            <input
                                type="date"
                                className="form-control"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Employee Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={employeeName}
                                onChange={(e) => setEmployeeName(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label d-flex justify-content-between align-items-center">
                                Tasks
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={insertArrowLine}
                                    title="Insert a new → line (same as Ctrl/Cmd + Enter)"
                                >
                                    → Insert
                                </button>
                            </label>
                            <textarea
                                ref={tasksRef}
                                rows={8}
                                className="form-control"
                                value={tasks}
                                onChange={(e) => setTasks(e.target.value)}
                                onKeyDown={handleTasksKeyDown}
                                placeholder="Your tasks for today... (Ctrl/Cmd + Enter for a new → line)"
                            />
                        </div>
                        <p style={{ fontStyle: 'italic', marginTop: '0.5rem', color: '#888' }}>
                            💡 Use <strong>CTRL + Enter</strong> for new lines with arrow (→).
                        </p>
                    </div>
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label className="form-label d-flex justify-content-between">
                                Today's Task
                                <button
                                    className={`btn btn-sm ${copied.today ? "btn-success" : "btn-secondary"
                                        }`}
                                    onClick={() => handleCopy("today")}
                                >
                                    📋 {copied.today ? "Copied!" : "Copy"}
                                </button>
                            </label>

                            <textarea
                                className="form-control"
                                rows={8}
                                value={todayTaskOutput}
                                readOnly
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label d-flex justify-content-between">
                                Daily Report
                                <button
                                    className={`btn btn-sm ${copied.report ? "btn-success" : "btn-secondary"
                                        }`}
                                    onClick={() => handleCopy("report")}
                                >
                                    📋 {copied.report ? "Copied!" : "Copy"}
                                </button>
                            </label>
                            <textarea
                                className="form-control"
                                rows={8}
                                value={dailyReportOutput}
                                readOnly
                            />
                        </div>
                        <p style={{ fontStyle: 'italic', marginTop: '0.5rem', color: '#888' }}>
                            💡 Use <strong>CTRL + SHIFT + F</strong> in Slack to format code blocks properly after pasting.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DailyReportGenerator;

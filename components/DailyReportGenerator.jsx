"use client";
import React, { useEffect, useRef, useState } from "react";
import Head from 'next/head';

const DailyReportGenerator = () => {
    const [date, setDate] = useState("");
    const [employeeName, setEmployeeName] = useState("");
    const [tasks, setTasks] = useState("");
    const [copied, setCopied] = useState({ today: false, report: false });
    const [reserveTasks, setReserveTasks] = useState([]);
    const [reserveInput, setReserveInput] = useState("");
    const tasksRef = useRef(null);

    const STATUSES = ["In Progress", "Pending", "Completed"];
    const STATUS_REGEX = /\s*\[(In Progress|Pending|Completed)\]\s*$/;

    // Load from localStorage on mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedName = localStorage.getItem("employeeName") || "";
            const savedTasks = localStorage.getItem("tasks") || "";
            let savedReserve = [];
            try {
                savedReserve = JSON.parse(localStorage.getItem("reserveTasks") || "[]");
            } catch (err) {
                savedReserve = [];
            }

            console.log("Loaded from localStorage:", { savedName, savedTasks });

            const today = new Date().toISOString().split("T")[0];
            setDate(today);
            setEmployeeName(savedName);
            setTasks(savedTasks);
            setReserveTasks(Array.isArray(savedReserve) ? savedReserve : []);
        }
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (typeof window !== "undefined") {
                localStorage.setItem("employeeName", employeeName);
                localStorage.setItem("tasks", tasks);
                localStorage.setItem("reserveTasks", JSON.stringify(reserveTasks));
            }
        }, 500); // Save after 500ms of inactivity
        return () => clearTimeout(timeout);
    }, [employeeName, tasks, reserveTasks]);

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

    // Appends [Status] to the end of the line the cursor is on (replacing any existing status)
    const applyStatus = (status) => {
        if (!status) return;
        const textarea = tasksRef.current;
        const pos = textarea ? textarea.selectionStart : tasks.length;
        const lineStart = tasks.lastIndexOf("\n", pos - 1) + 1;
        let lineEnd = tasks.indexOf("\n", pos);
        if (lineEnd === -1) lineEnd = tasks.length;
        const line = tasks.slice(lineStart, lineEnd).replace(STATUS_REGEX, "");
        if (!line.trim()) return;
        const newLine = `${line} [${status}]`;
        setTasks(tasks.slice(0, lineStart) + newLine + tasks.slice(lineEnd));
        const cursorPos = lineStart + newLine.length;
        requestAnimationFrame(() => {
            if (!textarea) return;
            textarea.focus();
            textarea.selectionStart = textarea.selectionEnd = cursorPos;
        });
    };

    const addReserveTask = () => {
        const text = reserveInput.trim();
        if (!text) return;
        setReserveTasks((prev) => [...prev, text]);
        setReserveInput("");
    };

    const removeReserveTask = (index) => {
        setReserveTasks((prev) => prev.filter((_, i) => i !== index));
    };

    const moveReserveToToday = (index) => {
        const text = reserveTasks[index];
        const prefix = tasks.trim() === "" ? "" : tasks.endsWith("\n") ? "" : "\n";
        setTasks(tasks + prefix + "→ " + text);
        removeReserveTask(index);
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
                                <span className="d-flex gap-2">
                                    <select
                                        className="form-select form-select-sm"
                                        value=""
                                        onChange={(e) => applyStatus(e.target.value)}
                                        title="Add a status to the end of the current line"
                                    >
                                        <option value="">Status</option>
                                        {STATUSES.map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-secondary text-nowrap"
                                        onClick={insertArrowLine}
                                        title="Insert a new → line (same as Ctrl/Cmd + Enter)"
                                    >
                                        → Insert
                                    </button>
                                </span>
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
                        <div className="mb-3 mt-4">
                            <label className="form-label">Reserved Tasks (not in today's report)</label>
                            <div className="input-group mb-2">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={reserveInput}
                                    onChange={(e) => setReserveInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            addReserveTask();
                                        }
                                    }}
                                    placeholder="Save a task for later..."
                                />
                                <button type="button" className="btn btn-outline-secondary" onClick={addReserveTask}>
                                    + Add
                                </button>
                            </div>
                            {reserveTasks.length === 0 ? (
                                <p style={{ fontStyle: 'italic', color: '#888' }}>No reserved tasks.</p>
                            ) : (
                                <ul className="list-group">
                                    {reserveTasks.map((task, i) => (
                                        <li key={i} className="list-group-item d-flex justify-content-between align-items-center gap-2">
                                            <span style={{ wordBreak: 'break-word' }}>{task}</span>
                                            <span className="d-flex gap-1 text-nowrap">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => moveReserveToToday(i)}
                                                    title="Move to today's tasks"
                                                >
                                                    ↑ Add to Today
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => removeReserveTask(i)}
                                                    title="Delete"
                                                >
                                                    ✕
                                                </button>
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
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

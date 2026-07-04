"use client";
import React, { useState, useEffect, useRef } from "react";

const STORAGE_KEY = "kanban-board-data";

const DEFAULT_DATA = {
    columns: [
        { id: "todo", title: "To Do", color: "#e0f2fe" },
        { id: "inprogress", title: "In Progress", color: "#fef3c7" },
        { id: "done", title: "Done", color: "#dcfce7" },
    ],
    cardsByColumn: {
        todo: [],
        inprogress: [],
        done: [],
    },
    cardDetails: {},
};

const COLUMN_COLORS = [
    "#e0f2fe", "#fef3c7", "#dcfce7", "#fce7f3",
    "#ede9fe", "#ffe4e6", "#f1f5f9", "#fff7ed",
    "#cffafe", "#e0e7ff", "#fefce8", "#fdf4ff",
    "#f0fdf4", "#fef2f2", "#f0f9ff", "#ecfeff",
    "#f5f0ff", "#fff0f5", "#e8f5e9", "#fffde7",
];

const KanbanBoard = () => {
    const [data, setData] = useState(DEFAULT_DATA);
    const [loaded, setLoaded] = useState(false);
    const draggedCardRef = useRef(null);

    // Column modal state
    const [showColumnModal, setShowColumnModal] = useState(false);
    const [editingColumn, setEditingColumn] = useState(null);
    const [columnTitle, setColumnTitle] = useState("");
    const [columnColor, setColumnColor] = useState(COLUMN_COLORS[0]);

    // Card modal state
    const [showCardModal, setShowCardModal] = useState(false);
    const [editingCard, setEditingCard] = useState(null);
    const [activeColumnId, setActiveColumnId] = useState(null);
    const [cardTitle, setCardTitle] = useState("");
    const [cardDescription, setCardDescription] = useState("");

    // Load from localStorage
    useEffect(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    if (parsed && Array.isArray(parsed.columns)) {
                        setData(parsed);
                    }
                } catch (e) {
                    console.error("Failed to parse kanban data", e);
                }
            }
            setLoaded(true);
        }
    }, []);

    // Persist to localStorage
    useEffect(() => {
        if (!loaded) return;
        if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
    }, [data, loaded]);

    // ---------- Column CRUD ----------
    const openCreateColumnModal = () => {
        setEditingColumn(null);
        setColumnTitle("");
        setColumnColor(COLUMN_COLORS[data.columns.length % COLUMN_COLORS.length]);
        setShowColumnModal(true);
    };

    const openEditColumnModal = (column) => {
        setEditingColumn(column);
        setColumnTitle(column.title);
        setColumnColor(column.color || COLUMN_COLORS[0]);
        setShowColumnModal(true);
    };

    const closeColumnModal = () => {
        setShowColumnModal(false);
        setEditingColumn(null);
        setColumnTitle("");
        setColumnColor(COLUMN_COLORS[0]);
    };

    const handleSaveColumn = () => {
        const title = columnTitle.trim();
        if (!title) {
            closeColumnModal();
            return;
        }

        if (editingColumn) {
            setData((prev) => ({
                ...prev,
                columns: prev.columns.map((c) =>
                    c.id === editingColumn.id ? { ...c, title, color: columnColor } : c
                ),
            }));
        } else {
            const id = Date.now().toString();
            setData((prev) => ({
                ...prev,
                columns: [...prev.columns, { id, title, color: columnColor }],
                cardsByColumn: { ...prev.cardsByColumn, [id]: [] },
            }));
        }
        closeColumnModal();
    };

    const handleDeleteColumn = (columnId) => {
        if (!window.confirm("Delete this status and all its cards?")) return;
        setData((prev) => {
            const cardIds = prev.cardsByColumn[columnId] || [];
            const newCardDetails = { ...prev.cardDetails };
            cardIds.forEach((id) => delete newCardDetails[id]);
            const newCardsByColumn = { ...prev.cardsByColumn };
            delete newCardsByColumn[columnId];
            return {
                ...prev,
                columns: prev.columns.filter((c) => c.id !== columnId),
                cardsByColumn: newCardsByColumn,
                cardDetails: newCardDetails,
            };
        });
    };

    const moveColumn = (columnId, direction) => {
        setData((prev) => {
            const columns = [...prev.columns];
            const index = columns.findIndex((c) => c.id === columnId);
            const targetIndex = index + direction;
            if (targetIndex < 0 || targetIndex >= columns.length) return prev;
            [columns[index], columns[targetIndex]] = [columns[targetIndex], columns[index]];
            return { ...prev, columns };
        });
    };

    // ---------- Card CRUD ----------
    const openCreateCardModal = (columnId) => {
        setEditingCard(null);
        setActiveColumnId(columnId);
        setCardTitle("");
        setCardDescription("");
        setShowCardModal(true);
    };

    const openEditCardModal = (columnId, cardId) => {
        const card = data.cardDetails[cardId];
        setEditingCard(cardId);
        setActiveColumnId(columnId);
        setCardTitle(card.title);
        setCardDescription(card.description || "");
        setShowCardModal(true);
    };

    const closeCardModal = () => {
        setShowCardModal(false);
        setEditingCard(null);
        setActiveColumnId(null);
        setCardTitle("");
        setCardDescription("");
    };

    const handleSaveCard = () => {
        const title = cardTitle.trim();
        if (!title) {
            closeCardModal();
            return;
        }

        if (editingCard) {
            setData((prev) => ({
                ...prev,
                cardDetails: {
                    ...prev.cardDetails,
                    [editingCard]: {
                        ...prev.cardDetails[editingCard],
                        title,
                        description: cardDescription.trim(),
                        updatedAt: new Date().toISOString(),
                    },
                },
            }));
        } else {
            const id = Date.now().toString();
            setData((prev) => ({
                ...prev,
                cardDetails: {
                    ...prev.cardDetails,
                    [id]: {
                        title,
                        description: cardDescription.trim(),
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    },
                },
                cardsByColumn: {
                    ...prev.cardsByColumn,
                    [activeColumnId]: [...(prev.cardsByColumn[activeColumnId] || []), id],
                },
            }));
        }
        closeCardModal();
    };

    const handleDeleteCard = (columnId, cardId) => {
        if (!window.confirm("Delete this card?")) return;
        setData((prev) => {
            const newCardDetails = { ...prev.cardDetails };
            delete newCardDetails[cardId];
            return {
                ...prev,
                cardDetails: newCardDetails,
                cardsByColumn: {
                    ...prev.cardsByColumn,
                    [columnId]: prev.cardsByColumn[columnId].filter((id) => id !== cardId),
                },
            };
        });
    };

    const moveCard = (columnId, cardId, direction) => {
        setData((prev) => {
            const ids = [...prev.cardsByColumn[columnId]];
            const index = ids.indexOf(cardId);
            const targetIndex = index + direction;
            if (targetIndex < 0 || targetIndex >= ids.length) return prev;
            [ids[index], ids[targetIndex]] = [ids[targetIndex], ids[index]];
            return {
                ...prev,
                cardsByColumn: { ...prev.cardsByColumn, [columnId]: ids },
            };
        });
    };

    // ---------- Drag and Drop ----------
    const handleDragStart = (columnId, cardId) => {
        draggedCardRef.current = { columnId, cardId };
    };

    const handleDragEnd = () => {
        draggedCardRef.current = null;
    };

    const removeCardFromColumns = (cardsByColumn, cardId) => {
        const next = {};
        Object.keys(cardsByColumn).forEach((colId) => {
            next[colId] = cardsByColumn[colId].filter((id) => id !== cardId);
        });
        return next;
    };

    const handleDropOnCard = (e, targetColumnId, targetCardId) => {
        e.preventDefault();
        e.stopPropagation();
        const dragged = draggedCardRef.current;
        if (!dragged || dragged.cardId === targetCardId) return;

        setData((prev) => {
            const cardsByColumn = removeCardFromColumns(prev.cardsByColumn, dragged.cardId);
            const targetList = [...cardsByColumn[targetColumnId]];
            const targetIndex = targetList.indexOf(targetCardId);
            targetList.splice(targetIndex, 0, dragged.cardId);
            cardsByColumn[targetColumnId] = targetList;
            return { ...prev, cardsByColumn };
        });
        draggedCardRef.current = null;
    };

    const handleDropOnColumn = (e, columnId) => {
        e.preventDefault();
        const dragged = draggedCardRef.current;
        if (!dragged) return;

        setData((prev) => {
            const cardsByColumn = removeCardFromColumns(prev.cardsByColumn, dragged.cardId);
            cardsByColumn[columnId] = [...cardsByColumn[columnId], dragged.cardId];
            return { ...prev, cardsByColumn };
        });
        draggedCardRef.current = null;
    };

    return (
        <div className="min-vh-100 bg-light p-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <h3 className="fw-bold mb-1">
                        <i className="bi bi-kanban me-2 text-success"></i>Kanban Board
                    </h3>
                    <p className="text-muted mb-0">
                        Create statuses, add cards, and drag &amp; drop or use the arrows to reorder.
                    </p>
                </div>
                <button
                    className="btn btn-success rounded-3 px-4 py-2 d-flex align-items-center gap-2 shadow-sm"
                    onClick={openCreateColumnModal}
                >
                    <i className="bi bi-plus-lg"></i>
                    <span>New Status</span>
                </button>
            </div>

            <div className="d-flex gap-3 overflow-auto pb-3" style={{ alignItems: "flex-start" }}>
                {data.columns.map((column, colIndex) => {
                    const cardIds = data.cardsByColumn[column.id] || [];
                    return (
                        <div
                            key={column.id}
                            className="rounded-4 shadow-sm flex-shrink-0"
                            style={{
                                width: "300px",
                                backgroundColor: column.color || COLUMN_COLORS[colIndex % COLUMN_COLORS.length],
                            }}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handleDropOnColumn(e, column.id)}
                        >
                            <div className="d-flex justify-content-between align-items-center p-3 pb-2">
                                <h6 className="fw-bold mb-0 text-dark">
                                    {column.title}
                                    <span className="badge bg-white text-dark ms-2 fw-normal">
                                        {cardIds.length}
                                    </span>
                                </h6>
                                <div className="d-flex align-items-center gap-1">
                                    <button
                                        className="btn btn-sm btn-link text-dark p-1"
                                        disabled={colIndex === 0}
                                        title="Move status left"
                                        onClick={() => moveColumn(column.id, -1)}
                                    >
                                        <i className="bi bi-arrow-left"></i>
                                    </button>
                                    <button
                                        className="btn btn-sm btn-link text-dark p-1"
                                        disabled={colIndex === data.columns.length - 1}
                                        title="Move status right"
                                        onClick={() => moveColumn(column.id, 1)}
                                    >
                                        <i className="bi bi-arrow-right"></i>
                                    </button>
                                    <button
                                        className="btn btn-sm btn-link text-dark p-1"
                                        title="Rename status"
                                        onClick={() => openEditColumnModal(column)}
                                    >
                                        <i className="bi bi-pencil"></i>
                                    </button>
                                    <button
                                        className="btn btn-sm btn-link text-danger p-1"
                                        title="Delete status"
                                        onClick={() => handleDeleteColumn(column.id)}
                                    >
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>

                            <div className="px-3 pb-3 d-flex flex-column gap-2" style={{ minHeight: "60px" }}>
                                {cardIds.map((cardId, cardIndex) => {
                                    const card = data.cardDetails[cardId];
                                    if (!card) return null;
                                    return (
                                        <div
                                            key={cardId}
                                            draggable
                                            onDragStart={() => handleDragStart(column.id, cardId)}
                                            onDragEnd={handleDragEnd}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={(e) => handleDropOnCard(e, column.id, cardId)}
                                            className="card border-0 shadow-sm rounded-3"
                                            style={{ cursor: "grab" }}
                                        >
                                            <div className="card-body p-3">
                                                <div className="d-flex justify-content-between align-items-start">
                                                    <p className="fw-semibold mb-1" style={{ wordBreak: "break-word" }}>
                                                        {card.title}
                                                    </p>
                                                    <i className="bi bi-grip-vertical text-muted"></i>
                                                </div>
                                                {card.description && (
                                                    <p
                                                        className="text-muted small mb-2"
                                                        style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                                                    >
                                                        {card.description}
                                                    </p>
                                                )}
                                                <div className="d-flex justify-content-between align-items-center mt-2">
                                                    <div className="d-flex gap-1">
                                                        <button
                                                            className="btn btn-sm btn-light p-1"
                                                            disabled={cardIndex === 0}
                                                            title="Move up"
                                                            onClick={() => moveCard(column.id, cardId, -1)}
                                                        >
                                                            <i className="bi bi-arrow-up"></i>
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-light p-1"
                                                            disabled={cardIndex === cardIds.length - 1}
                                                            title="Move down"
                                                            onClick={() => moveCard(column.id, cardId, 1)}
                                                        >
                                                            <i className="bi bi-arrow-down"></i>
                                                        </button>
                                                    </div>
                                                    <div className="d-flex gap-1">
                                                        <button
                                                            className="btn btn-sm btn-light p-1"
                                                            title="Edit card"
                                                            onClick={() => openEditCardModal(column.id, cardId)}
                                                        >
                                                            <i className="bi bi-pencil"></i>
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-light text-danger p-1"
                                                            title="Delete card"
                                                            onClick={() => handleDeleteCard(column.id, cardId)}
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                <button
                                    className="btn btn-sm btn-outline-secondary border-0 bg-white d-flex align-items-center justify-content-center gap-1 rounded-3 py-2 mt-1"
                                    onClick={() => openCreateCardModal(column.id)}
                                >
                                    <i className="bi bi-plus-lg"></i>
                                    <span>Add Card</span>
                                </button>
                            </div>
                        </div>
                    );
                })}

                {data.columns.length === 0 && (
                    <div className="text-center py-5 w-100">
                        <p className="text-muted">No statuses yet. Click "New Status" to create your first column.</p>
                    </div>
                )}
            </div>

            {/* Column Modal */}
            <div
                className={`modal fade ${showColumnModal ? "show d-block" : ""}`}
                tabIndex={-1}
                style={{ backgroundColor: showColumnModal ? "rgba(0,0,0,0.5)" : "transparent" }}
                onClick={(e) => {
                    if (e.target === e.currentTarget) closeColumnModal();
                }}
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content rounded-4 border-0 shadow-lg">
                        <div className="modal-header border-0 pb-0">
                            <h5 className="modal-title fw-semibold">
                                {editingColumn ? "Rename Status" : "New Status"}
                            </h5>
                            <button type="button" className="btn-close" onClick={closeColumnModal}></button>
                        </div>
                        <div className="modal-body p-4">
                            <input
                                type="text"
                                className="form-control mb-4"
                                placeholder="Status name (e.g. Backlog)"
                                value={columnTitle}
                                onChange={(e) => setColumnTitle(e.target.value)}
                                autoFocus
                                onKeyDown={(e) => e.key === "Enter" && handleSaveColumn()}
                            />
                            <div className="mb-1">
                                <label className="form-label fw-semibold small text-secondary mb-2 d-flex align-items-center gap-2">
                                    Column Color
                                    <span
                                        className="rounded-2 d-inline-block"
                                        style={{ width: 20, height: 20, background: columnColor, border: "1px solid rgba(0,0,0,0.1)" }}
                                    />
                                </label>
                                <div className="d-flex flex-wrap gap-2">
                                    {COLUMN_COLORS.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setColumnColor(color)}
                                            style={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: 8,
                                                backgroundColor: color,
                                                border: columnColor === color
                                                    ? "3px solid #333"
                                                    : "2px solid rgba(0,0,0,0.1)",
                                                boxShadow: columnColor === color ? "0 0 0 2px white inset" : "none",
                                                cursor: "pointer",
                                                padding: 0,
                                            }}
                                            title={color}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer border-0 pt-0">
                            <button type="button" className="btn btn-link text-secondary" onClick={closeColumnModal}>
                                Cancel
                            </button>
                            <button type="button" className="btn btn-success" onClick={handleSaveColumn}>
                                {editingColumn ? "Save" : "Create"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Card Modal */}
            <div
                className={`modal fade ${showCardModal ? "show d-block" : ""}`}
                tabIndex={-1}
                style={{ backgroundColor: showCardModal ? "rgba(0,0,0,0.5)" : "transparent" }}
                onClick={(e) => {
                    if (e.target === e.currentTarget) closeCardModal();
                }}
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content rounded-4 border-0 shadow-lg">
                        <div className="modal-header border-0 pb-0">
                            <h5 className="modal-title fw-semibold">
                                {editingCard ? "Edit Card" : "New Card"}
                            </h5>
                            <button type="button" className="btn-close" onClick={closeCardModal}></button>
                        </div>
                        <div className="modal-body p-4">
                            <input
                                type="text"
                                className="form-control mb-3"
                                placeholder="Card title"
                                value={cardTitle}
                                onChange={(e) => setCardTitle(e.target.value)}
                                autoFocus
                            />
                            <textarea
                                className="form-control"
                                placeholder="Description (optional)"
                                rows={4}
                                value={cardDescription}
                                onChange={(e) => setCardDescription(e.target.value)}
                            ></textarea>
                        </div>
                        <div className="modal-footer border-0 pt-0">
                            <button type="button" className="btn btn-link text-secondary" onClick={closeCardModal}>
                                Cancel
                            </button>
                            <button type="button" className="btn btn-success" onClick={handleSaveCard}>
                                {editingCard ? "Update" : "Create"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KanbanBoard;

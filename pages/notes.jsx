// app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';

// Available note colors (modern pastel palette)
const NOTE_COLORS = [
    '#ffffff',     // White
    '#fef3c7',     // Soft Yellow
    '#ffedd5',     // Soft Orange
    '#fce7f3',     // Soft Pink
    '#ffe4e6',     // Soft Rose
    '#f3e8ff',     // Soft Purple
    '#ede9fe',     // Soft Violet
    '#e0f2fe',     // Soft Blue
    '#dbeafe',     // Light Blue
    '#dcfce7',     // Soft Green
    '#ccfbf1',     // Mint
    '#f1f5f9',     // Slate
];


export default function Notes() {
    const [notes, setNotes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [editingNote, setEditingNote] = useState(null);

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    // Form state
    const [formTitle, setFormTitle] = useState('');
    const [formContent, setFormContent] = useState('');
    const [formColor, setFormColor] = useState('#ffffff');

    // Load notes from localStorage on mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedNotes = localStorage.getItem('modern-notes');

            console.log('Raw stored notes:', storedNotes);

            if (storedNotes && storedNotes !== 'undefined') {
                try {
                    const parsed = JSON.parse(storedNotes);
                    if (Array.isArray(parsed)) {
                        // Convert date strings back to Date objects
                        const notesWithDates = parsed.map((note) => ({
                            ...note,
                            createdAt: new Date(note.createdAt),
                            updatedAt: new Date(note.updatedAt),
                        }));
                        setNotes(notesWithDates);
                        console.log('Notes loaded:', notesWithDates);
                    } else {
                        setNotes([]); // Set empty array if parsed value is not an array
                    }
                } catch (e) {
                    console.error('Failed to parse notes', e);
                    setNotes([]); // Set empty array on error
                }
            } else {
                // No stored notes or invalid value - initialize with empty array
                setNotes([]);
                console.log('No valid notes found, initialized empty array');
            }
        }
    }, []);

    // Save notes to localStorage whenever they change
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (typeof window !== "undefined") {
                localStorage.setItem('modern-notes', JSON.stringify(notes));
            }
        }, 500); // Save after 500ms of inactivity
        return () => clearTimeout(timeout);
    }, [notes]);


    // Open modal for creating new note
    const openCreateModal = () => {
        resetForm();
        setIsEditMode(false);
        setEditingNote(null);
        setShowModal(true);
    };

    // Open modal for editing note
    const openEditModal = (note) => {
        setEditingNote(note);
        setFormTitle(note.title);
        setFormContent(note.content);
        setFormColor(note.color);
        setIsEditMode(true);
        setShowModal(true);
    };

    // Close modal
    const closeModal = () => {
        setShowModal(false);
        resetForm();
        setEditingNote(null);
        setIsEditMode(false);
    };

    // Create a new note
    const handleCreateNote = () => {
        if (!formTitle.trim() && !formContent.trim()) {
            closeModal();
            // setIsCreating(false);
            return;
        }

        const newNote = {
            id: Date.now().toString(),
            title: formTitle.trim() || 'Untitled',
            content: formContent.trim(),
            color: formColor,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        setNotes([newNote, ...notes]);
        resetForm();
        closeModal();
        // setIsCreating(false);
    };

    // Update an existing note
    const handleUpdateNote = () => {
        if (!editingNote) return;

        const updatedNote = {
            ...editingNote,
            title: formTitle.trim() || 'Untitled',
            content: formContent.trim(),
            color: formColor,
            updatedAt: new Date(),
        };

        setNotes(notes.map(note => note.id === editingNote.id ? updatedNote : note));
        resetForm();
        closeModal();
        // setEditingNote(null);
    };

    // Delete a note
    const handleDeleteNote = (id) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            setNotes(notes.filter(note => note.id !== id));
        }
    };

    // Start editing a note
    const handleEditNote = (note) => {
        setEditingNote(note);
        setFormTitle(note.title);
        setFormContent(note.content);
        setFormColor(note.color);
        setIsCreating(true);
    };

    // Reset form state
    const resetForm = () => {
        setFormTitle('');
        setFormContent('');
        setFormColor('#ffffff');
    };

    // Cancel creating/editing
    const handleCancel = () => {
        resetForm();
        setIsCreating(false);
        setEditingNote(null);
    };

    // Filter notes based on search
    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Format date for display
    const formatDate = (date) => {
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="min-vh-100 bg-light p-4">
            <div>
                {/* Header Section with Search and Add Button */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mb-4">
                    <div className="position-relative w-100 w-md-50" style={{ maxWidth: '400px' }}>
                        <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary"></i>
                        <input
                            type="text"
                            className="form-control py-3 ps-5 rounded-3 border-0 shadow-sm"
                            placeholder="Search notes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ backgroundColor: '#fff' }}
                        />
                    </div>

                    {!isCreating && (
                        <button
                            // onClick={() => setIsCreating(true)}
                            onClick={openCreateModal}
                            className="btn btn-primary rounded-3 px-4 py-3 d-flex align-items-center gap-2 shadow-sm"
                            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
                        >
                            <i className="bi bi-plus-lg"></i>
                            <span>New Note</span>
                        </button>
                    )}
                </div>



                {/* Notes Grid */}
                {filteredNotes.length === 0 ? (
                    <div className="text-center py-5 mt-5">
                        <div className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow-sm" style={{ width: '80px', height: '80px' }}>
                            <i className="bi bi-journal-text fs-1 text-secondary"></i>
                        </div>
                        <h5 className="text-secondary mb-2">No notes found</h5>
                        <p className="text-muted">
                            {searchTerm ? 'Try a different search term' : 'Click "New Note" to create your first note'}
                        </p>
                    </div>
                ) : (
                    <div className="row g-4">
                        {filteredNotes.map((note) => (
                            <div key={note.id} className="col-sm-6 col-lg-4 col-xl-3">
                                <div
                                    className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden transition-all"
                                    style={{
                                        backgroundColor: note.color,
                                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-4px)';
                                        e.currentTarget.style.boxShadow = '0 1rem 2rem rgba(0,0,0,0.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 0.125rem 0.25rem rgba(0,0,0,0.075)';
                                    }}
                                >
                                    <div className="card-body p-4">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <h6 className="card-title fw-semibold text-dark mb-0 fs-5" style={{ wordBreak: 'break-word' }}>
                                                {note.title}
                                            </h6>

                                            <div className='d-flex align-items-end'>
                                                <button
                                                    className="d-flex align-items-center gap-2  border-0 bg-transparent"
                                                    onClick={() => openEditModal(note)}
                                                >
                                                    <i className="bi bi-pencil"></i>
                                                </button>
                                                <button
                                                    className="d-flex align-items-center gap-2 text-danger border-0 bg-transparent"
                                                    onClick={() => handleDeleteNote(note.id)}
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </div>

                                        <p className="card-text text-secondary small mt-2" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                            {note.content || <span className="text-muted fst-italic">No additional content</span>}
                                        </p>
                                    </div>

                                    <div className="card-footer bg-transparent border-0 pt-0 pb-3 px-4">
                                        <small className="text-muted">
                                            <i className="bi bi-clock me-1"></i>
                                            Updated {formatDate(new Date(note.updatedAt))}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>


            {/* Bootstrap Modal for Create/Edit Note */}
            <div
                className={`modal fade ${showModal ? 'show d-block' : ''}`}
                tabIndex={-1}
                style={{ backgroundColor: showModal ? 'rgba(0,0,0,0.5)' : 'transparent', display: showModal ? 'block' : 'none' }}
                onClick={(e) => {
                    if (e.target === e.currentTarget) closeModal();
                }}
            >
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content rounded-4 border-0 shadow-lg" style={{ backgroundColor: formColor }}>
                        <div className="modal-header border-0 pb-0">
                            <h5 className="modal-title fs-3 fw-semibold">
                                {isEditMode ? 'Edit Note' : 'Create New Note'}
                            </h5>
                            <button type="button" className="btn-close" onClick={closeModal}></button>
                        </div>

                        <div className="modal-body p-4">
                            <input
                                type="text"
                                className="form-control form-control-lg border-0 border-bottom rounded-0 px-0 fs-2 fw-semibold mb-3"
                                placeholder="Title"
                                value={formTitle}
                                onChange={(e) => setFormTitle(e.target.value)}
                                style={{ backgroundColor: 'transparent', outline: 'none' }}
                                autoFocus
                            />

                            <textarea
                                className="form-control border-0 px-0 shadow-none"
                                placeholder="Take a note..."
                                value={formContent}
                                onChange={(e) => setFormContent(e.target.value)}
                                rows={6}
                                style={{ backgroundColor: 'transparent', resize: 'none', fontSize: '1rem' }}
                            ></textarea>

                            {/* Color Picker */}
                            <div className="mt-4 pt-2">
                                <label className="form-label text-secondary d-flex align-items-center gap-2 mb-3">
                                    <i className="bi bi-palette fs-5"></i>
                                    <span>Choose note color</span>
                                </label>
                                <div className="d-flex gap-2 flex-wrap">
                                    {NOTE_COLORS.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setFormColor(color)}
                                            className={`btn p-0 rounded-circle transition-all ${formColor === color ? 'shadow-lg' : ''}`}
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                backgroundColor: color,
                                                border: color === '#ffffff' ? '2px solid #dee2e6' : '2px solid transparent',
                                                transform: formColor === color ? 'scale(1.15)' : 'scale(1)',
                                                transition: 'all 0.2s ease'
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer border-0 pt-0 pb-4">
                            <button
                                type="button"
                                className="btn btn-link text-secondary text-decoration-none px-4"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={isEditMode ? handleUpdateNote : handleCreateNote}
                                className="btn btn-primary rounded-3 px-4 py-2 d-flex align-items-center gap-2"
                                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
                            >
                                <i className="bi bi-check-lg fs-5"></i>
                                <span className="fw-semibold">{isEditMode ? 'Update Note' : 'Create Note'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .transition-all {
          transition: all 0.2s ease;
        }
        .card:hover .opacity-0-hover {
          opacity: 1 !important;
        }
        .modal.show {
          background-color: rgba(0,0,0,0.5) !important;
        }
        .form-control:focus {
          box-shadow: none;
          border-color: #dee2e6;
        }
        textarea:focus {
          box-shadow: none !important;
        }
        .btn-primary:hover {
          background: linear-gradient(135deg, #5a67d8 0%, #6b46a0 100%) !important;
          transform: translateY(-1px);
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate3d(0, 20px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
        .animate__animated {
          animation-duration: 0.3s;
          animation-fill-mode: both;
        }
        .animate__fadeInUp {
          animation-name: fadeInUp;
        }
        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .btn-primary:hover {
          background: linear-gradient(135deg, #5a67d8 0%, #6b46a0 100%);
          transform: translateY(-1px);
        }
      `}</style>
        </div>
    );
}
import React, { useState } from 'react'
import { MdEditor } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import { MdPreview, MdCatalog, config } from 'md-editor-rt';
import 'md-editor-rt/lib/preview.css';

config({
    editorConfig: {
        renderDelay: 0
    }
});

const markdown_editor = () => {
    const [text, setText] = useState('# Hello Editor');
    const [id] = useState('preview-only');
    const formatCopiedText = (text) => {
        return `${text}  - from md-editor-rt`;
    };


    return (
        <>
            <MdEditor language="en-US" formatCopiedText={formatCopiedText} modelValue={text} onChange={setText} />
        </>

    )
}

export default markdown_editor
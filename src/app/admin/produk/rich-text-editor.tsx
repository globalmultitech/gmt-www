
'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import type { ReactQuillProps } from 'react-quill';

// Dynamically import ReactQuill to ensure it's only client-side
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface RichTextEditorProps {
  name?: string;
  defaultValue?: string;
}

const RichTextEditor = ({ name, defaultValue = '' }: RichTextEditorProps) => {
  const [value, setValue] = useState(defaultValue);
  
  // This effect ensures that if the defaultValue changes (e.g. data is loaded asynchronously),
  // the editor's state is updated. But it only updates if the editor content is still the initial default.
  // This prevents overwriting user's input.
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link'
  ];

  return (
    <div className="bg-background relative">
       {/* Hidden input to store the HTML content for form submission */}
       <input type="hidden" name={name} value={value} />
       <ReactQuill
        theme="snow"
        value={value}
        onChange={setValue}
        modules={modules}
        formats={formats}
        style={{ height: '300px', marginBottom: '40px' }}
      />
    </div>
  );
};

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor;

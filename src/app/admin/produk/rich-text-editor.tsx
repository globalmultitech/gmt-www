
'use client';

import React, { forwardRef, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import type { ReactQuillProps } from 'react-quill';

// Dynamically import ReactQuill to ensure it's only client-side
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill');
    // The wrapper is necessary to forward the ref correctly in React 18
    // eslint-disable-next-line react/display-name
    return ({ forwardedRef, ...props }: { forwardedRef: React.Ref<any> } & ReactQuillProps) => (
      <RQ ref={forwardedRef} {...props} />
    );
  },
  {
    ssr: false,
  }
);

interface RichTextEditorProps {
  name?: string;
  defaultValue?: string;
}

const RichTextEditor = ({ name, defaultValue = '' }: RichTextEditorProps) => {
  const [value, setValue] = useState(defaultValue);
  
  // Update internal state if the defaultValue prop changes (e.g., when form data loads)
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

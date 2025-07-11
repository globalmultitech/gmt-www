
'use client';

import React, { forwardRef } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import type { ReactQuillProps } from 'react-quill';

// Dynamically import ReactQuill to ensure it's only client-side
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill');
    // eslint-disable-next-line react/display-name
    return ({ forwardedRef, ...props }: { forwardedRef: React.Ref<any> } & ReactQuillProps) => <RQ ref={forwardedRef} {...props} />;
  },
  { ssr: false }
);

interface RichTextEditorProps extends ReactQuillProps {
  name?: string;
}

const RichTextEditor = forwardRef<any, RichTextEditorProps>((props, ref) => {
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
       <input type="hidden" name={props.name} value={props.value as string} />
       <ReactQuill
        forwardedRef={ref}
        theme="snow"
        modules={modules}
        formats={formats}
        style={{ height: '300px', marginBottom: '40px' }}
        {...props}
      />
    </div>
  );
});

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor;

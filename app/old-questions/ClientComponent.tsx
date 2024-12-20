'use client';

import React, { useState, useEffect } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import ClientMdx from '@/components/ClientMdx';

registerPlugin(FilePondPluginFileValidateType, FilePondPluginFileEncode, FilePondPluginFileValidateSize);

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<MDXRemoteSerializeResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedResult = localStorage.getItem('mdxResult');
    const savedFileName = localStorage.getItem('fileName');
    if (savedResult && savedFileName) {
      setResult(JSON.parse(savedResult));
    }
  }, []);

  const handleAnalyze = () => {
    if (!file) {
      setError('Please select a file');
      console.error('No file selected');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('filepond', file);

    fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error('File upload failed: ' + response.statusText);
        }
      })
      .then(async (text) => {
        const { serialize } = await import('next-mdx-remote/serialize');
        const mdxSource = await serialize(text);
        setResult(mdxSource);
        localStorage.setItem('mdxResult', JSON.stringify(mdxSource));
        localStorage.setItem('fileName', file.name);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  return (
    <div className="flex justify-between">
      <div className="ml-2 w-1/3">
      <div className={`${error ? 'border-red-500 border-2 rounded p-4' : ''}`}>
        <FilePond
          allowMultiple={false}
          acceptedFileTypes={['application/pdf']}
          maxFileSize="4MB"
          onupdatefiles={(fileItems) => {
            setFile(fileItems.length > 0 ? (fileItems[0].file as File) : null);
            setError(null);
          }}
          onprocessfile={(error, file) => {
            if (error) {
              setError('Error processing file: ' + error);
            }
          }}
          />
        {error && <p className="text-red-500">{error}</p>}
        </div>
        <button
          onClick={handleAnalyze}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>
      <div className="container max-w-3xl">
        {loading ? (
          <p className='container'>Analyzing...</p>
        ) : result ? (
          <main className="prose dark:prose-invert">
            <ClientMdx {...result} />
          </main>
        ) : (
          <p>No analysis result yet.</p>
        )}
      </div>
    </div>
  );
}
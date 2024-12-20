'use client';
import React, { useEffect, useState } from 'react';
import ClientMdx from '../ClientMdx';
import {serialize} from 'next-mdx-remote/serialize';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';

interface ShowMdxContentProps {
  content: string;
}

const ShowMdxContent: React.FC<ShowMdxContentProps> = ({ content }) => {
  const [result, setResult] = useState<MDXRemoteSerializeResult | null>(null);
  useEffect(() => {
     const serializeContent = async () => {
      const mdxSource = await serialize(content);
      setResult(mdxSource);
     };
      serializeContent();
  }, []);
  return (
    <main className="prose dark:prose-invert">
      {result && <ClientMdx {...result}/>}
    </main>
  );
};

export default ShowMdxContent;
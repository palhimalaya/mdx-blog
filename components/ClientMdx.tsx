import { JSX } from 'react';
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote';


export default function ClientMdx(
  props: JSX.IntrinsicAttributes & MDXRemoteProps
) {
  return (
    <MDXRemote
      {...props}
    />
  );
}
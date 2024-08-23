import React from 'react'
import Head from 'next/head';
import { ModelViewer } from '../../components/ModelViewer';
export default function Page() {
  return (
    <>
    <Head>
      <title>3D Model Viewer</title>
    </Head>
    <div style={{ height: '100vh' }}>
      <ModelViewer />
    </div>
  </>
  )
}

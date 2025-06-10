import esbuild from 'esbuild';
import fs from 'fs-extra';
import path from 'path';

const API_KEY = process.env.API_KEY || 'AIzaSyBaoW_4nBrBIxNbH34UfuW0QoiwkpWvnrE'; // Fallback for local testing

const build = async () => {
  // Ensure dist directory exists and is clean
  await fs.emptyDir('dist');

  // 1. Bundle JavaScript
  await esbuild.build({
    entryPoints: ['index.tsx'],
    bundle: true,
    outfile: 'dist/main.js',
    loader: {
      '.tsx': 'tsx',
    },
    jsx: 'automatic',
    define: {
      'process.env.API_KEY': JSON.stringify(API_KEY),
    },
    platform: 'browser',
    format: 'esm',
    sourcemap: true,
    minify: true,
  }).catch(() => process.exit(1));

  // 2. Copy static files
  const staticFiles = [
    'index.html',
    'manifest.json',
    'service-worker.js',
  ];

  for (const file of staticFiles) {
    await fs.copy(file, path.join('dist', file));
  }

  // Copy icons folder
  await fs.copy('icons', 'dist/icons');

  console.log('Build complete!');
};

build();
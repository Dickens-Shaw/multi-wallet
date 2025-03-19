import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [react(),
  nodePolyfills({
    globals: {
      Buffer: true,
    }
  })
  ],
  server: {
    port: 3000,
    // fs: {
    //   allow: [
    //     // 添加 multi-wallet 的 node_modules 路径
    //     path.resolve(__dirname, '../multi-wallet/node_modules'),
    //     // 包含 pnpm 的虚拟存储目录
    //     path.resolve(__dirname, '../multi-wallet/node_modules/.pnpm')
    //   ]
    // }
  },
  resolve: {
    alias: {
      '@config': path.resolve(__dirname, '../multi-wallet/src/config'),
      '@type': path.resolve(__dirname, '../multi-wallet/src/types'),
      '@components': path.resolve(__dirname, '../multi-wallet/src/components'),
      '@hooks': path.resolve(__dirname, '../multi-wallet/src/hooks'),
      '@utils': path.resolve(__dirname, '../multi-wallet/src/utils'),
      '@stores': path.resolve(__dirname, '../multi-wallet/src/stores'),
    },
  },

}) 
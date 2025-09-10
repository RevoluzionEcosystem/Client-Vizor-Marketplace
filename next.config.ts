import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    // Handle Node.js modules that shouldn't run in the browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        util: false,
        buffer: false,
        process: false,
        vm: false,
        zlib: false,
        querystring: false,
        url: false,
        http: false,
        https: false,
        assert: false,
        constants: false,
        timers: false,
        console: false,
        tty: false,
        net: false,
        child_process: false,
        cluster: false,
        module: false,
        perf_hooks: false,
        readline: false,
        repl: false,
        string_decoder: false,
        sys: false,
        v8: false,
        worker_threads: false,
      };
    }

    // Ignore certain packages that cause issues in browser environment
    config.externals = config.externals || [];
    if (!isServer) {
      config.externals.push({
        'utf-8-validate': 'commonjs utf-8-validate',
        'bufferutil': 'commonjs bufferutil',
      });
    }

    return config;
  },
};

export default nextConfig;
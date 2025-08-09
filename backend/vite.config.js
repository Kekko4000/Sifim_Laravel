import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [

        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.jsx',    // front-end
                'resources/js/admin.jsx',  // admin
            ],
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    server: {
        host: true,           // equivale a 0.0.0.0
        port: 5173,
        hmr: {
        host: 'localhost',  // il browser si connette a localhost:5173
        port: 5173,
        },
    },
});

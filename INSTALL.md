# Installation Guide for React + Vite Project

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (version 18.0.0 or higher)
- npm (version 8.0.0 or higher) or yarn

## Installation Steps

1. Clone the repository

```bash
git clone <your-repository-url>
cd <project-directory>
```

2. Install dependencies

```bash
npm install
# or if using yarn
yarn
```

3. Set up environment variables

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration values.

4. Start the development server

```bash
npm run dev
# or if using yarn
yarn dev
```

The application will be available at `http://localhost:5173` by default.

## Build for Production

To create a production build:

```bash
npm run build
# or if using yarn
yarn build
```

The built files will be in the `dist` directory.

## Additional Scripts

- `npm run preview`: Preview the production build locally
- `npm run lint`: Run ESLint to check code quality
- `npm run test`: Run tests (if configured)

## Troubleshooting

### Common Issues

1. **Port 5173 already in use**

   - Kill the process using the port or change the port in `vite.config.js`

2. **Node version conflicts**

   - Use nvm to switch to the correct Node version
   - Check `.nvmrc` file for the required version

3. **Module not found errors**
   - Delete `node_modules` and package-lock.json/yarn.lock
   - Run `npm install` or `yarn` again

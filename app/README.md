# CareerAI client

The client is a React 19, TypeScript, Vite, and Tailwind CSS application for CareerAI.

## Commands

```powershell
npm.cmd install
npm.cmd run dev
npm.cmd run build
npm.cmd run lint
```

`npm.cmd` avoids PowerShell execution-policy errors caused by the `npm.ps1` shim.

## Notes

- Application entry point: `src/main.tsx`
- Global Tailwind styles: `src/index.css`
- API endpoint base path: `/api/user`
- The client expects the server described in the repository root README.

# Project Instructions

## General Principles

- Always respect the existing design system, visual hierarchy, and UI consistency.
- The UI must be clean, accessible, and user-friendly.
- All user-facing text must be in Brazilian Portuguese (pt-BR).
- Solutions must be robust, secure, maintainable, and production-ready.
- Use only modern, stable versions of libraries and tools.
- Never guess implementations. If unsure, consult official documentation via Context7 MCP.
- Please reply in a concise style. Avoid unnecessary repetition or filler language. Avoid ("Done!", "Perfect!", these types of language.)

## React & Architecture
- Use React 19 (with Next.js), enable React Compiler, Tailwind CSS, Better-Auth and AbacatePay.
- Code organization:
    - `useState` hooks must always be at the top of the component.
    - Declarations come immediately after `useState`.
    - Methods go in the middle.
    - Avoid comments at all costs. Code must be self-explanatory and follow clean code principles.
- Hooks that do not return values (`useEffect`, etc.) must always be at the end — `useEffect` must be the last one.
    - Use `useEffect` only for real side effects: subscriptions, listeners, timers, imperative APIs.
- Do not use `useCallback`, `useMemo`, or `memo`.
    - The React Compiler already handles these optimizations automatically.
- Any button that displays only an icon must include:
    - `title`
    - `aria-label`
- If an SVG is presented alongside text and does not include `aria-label`, it must include the property `role="presentation"`.
- Prefer Shadcn UI components:
    - Whenever a Shadcn component is required, use the Shadcn CLI to add it.
    - Never create Shadcn components manually.
    - After adding, adapt the component to follow project guidelines.
    - If Shadcn is not viable, use Radix UI.
- Building components from scratch is a last resort.
- Never use `forwardRef`.
    - If encountered, migrate to the React 19 ref-as-prop pattern.
- ESLint and TypeScript issues must be fixed at the root.
    - Never silence errors with comments, ignores, or disables.

## Navigation & UX

- All user redirects must use View Transitions.
- Always consider:
    - UX flow
    - Performance
    - Accessibility
- Implement semantic HTML, keyboard navigation, and ARIA where applicable.

## Styling

- Strictly follow Tailwind CSS conventions and existing tokens.
- Never introduce ad-hoc styles that break the design system.
- Avoid visual noise and unnecessary abstractions.
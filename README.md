# Diagram App

A modern web application for creating, editing, and managing diagrams. Built with Next.js, Zustand, and Konva.

## Features

- Drag-and-drop shapes (rectangles, circles, diamonds)
- Select, move, and resize shapes
- Delete shapes by dragging them to the trash
- Lock/unlock shapes
- Customizable shape properties (color, stroke, etc.)
- Responsive and intuitive UI

## Getting Started

### Prerequisites
- Node.js (v18 or newer recommended)
- npm or yarn

### Installation

```bash
npm install
# or
yarn install
```

### Running the App

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

## Project Structure

- `app/` — Next.js app directory (entry point, layout, global styles)
- `components/` — React components (canvas, dock, UI, shape renderer, store)
- `lib/` — Utility functions
- `public/` — Static assets (SVGs, icons)

## Usage

- Select a tool from the left bar
- Drag shapes onto the canvas
- Move shapes by dragging
- Resize or rotate selected shapes
- Delete shapes by dragging them to the trash icon


## License

MIT

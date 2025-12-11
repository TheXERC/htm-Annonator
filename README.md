# HTM Annotator

A powerful Next.js application designed for annotating local HTML files. Load your documents, highlight text in various colors, add comments, and manage your research effectively with a modern, dark-mode capable interface.

## Features

- **📄 File Support**: Drag and drop or select local `.htm` and `.html` files to start annotating immediately.
- **🎨 Rich Highlighting**: Highlight text in multiple colors (Yellow, Green, Blue, Pink, Orange) to categorize your findings.
- **💬 Comments**: Add detailed comments to any annotation to capture your thoughts or notes.
- **🌓 Dark Mode**: Fully integrated dark mode support for both the application interface and the loaded content, ensuring a comfortable reading experience in any environment.
- **📊 Annotation Management**:
  - **Sidebar**: A dedicated sidebar to view all annotations, sorted by time.
  - **Search**: Filter annotations by text content.
  - **Quick Actions**: Jump to annotation location, copy text, or delete individual annotations.
- **🛠️ Tools**:
  - **Floating Toolbar**: Appears automatically when you select text for quick highlighting.
  - **Context Menu**: Right-click to access annotation options.
  - **Zoom Controls**: Adjust the zoom level of the document for better readability.
- **💾 Import & Export**:
  - **Export**: Save your annotations as a JSON file to backup your work.
  - **Import**: Reload previously saved annotations to resume your session.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Theming**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Toast Notifications**: [Sonner](https://sonner.emilkowal.ski/)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/htm-annotator.git
   cd htm-annotator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage

1. **Load a File**: Click the "Upload HTML file" area or drag and drop an `.htm` or `.html` file into the window.
2. **Highlight Text**: Select any text in the document. A floating toolbar will appear. Click a color button to highlight.
3. **Add Comment**: Click the message icon on an annotation in the sidebar to add a note.
4. **Manage**: Use the sidebar to navigate through your annotations. You can search, delete, or copy text from there.
5. **Save Work**: Use the "Export Annotations" button in the top toolbar to save your progress.
6. **Resume**: Use "Import Annotations" to load a previously saved JSON file.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

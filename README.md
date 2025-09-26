# Medical PDF AI Assistant

## Overview

I've been experimenting with a few separate PDF handling and generative AI apps, and now I’m combining the individual components into a single project.

This app lets users:

* Upload a **medical document in PDF format**.
* Have the PDF **summarized by generative AI**.
* Ask **questions about the document**, which the AI will answer.
* Handle PDFs **with or without embedded text**. Scanned documents or photos taken with a mobile camera will be processed using **optical text recognition (OCR)**.
* Copy **extracted text** to the clipboard.

Think of it as a personal assistant for understanding medical PDFs quickly.

---

## Tech Stack

* **Backend:** Node.js
* **Frontend:** React
* **Styling:** Tailwind CSS
* **PDF Processing:** PDF parsing + OCR for scanned documents
* **AI Integration:** Generative AI for summaries and Q\&A

---

## Getting Started

### Clone the repo

```bash
git clone https://github.com/<YOUR_USERNAME>/medical-pdf-assistant.git
cd medical-pdf-assistant
```

### Install dependencies

```bash
# For backend
cd server
npm install

# For frontend
cd ../client
npm install
```

### Run the project

```bash
# Start the backend server
cd ../server
npm run dev

# Start the React frontend
cd ../client
npm run dev
```

Now open your browser at `http://localhost:5173` (or the port Vite provides) to see the interface.

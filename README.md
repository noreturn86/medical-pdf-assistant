# Medical PDF AI Assistant

## Overview

I've been experimenting with a few separate PDF handling and generative AI apps, and now I’m combining the individual components into a single project.

This project is just getting started — right now, you’ll see a **basic React + Tailwind CSS interface**, but the goal is to integrate the various smaller projects into one smooth experience.

The **final product** will let users:

* Upload a **medical document in PDF format**.
* Have the PDF **summarized by generative AI**.
* Ask **questions about the document**, which the AI will answer.
* Handle PDFs **with or without embedded text**. Scanned documents or photos taken with a mobile camera will be processed using **optical text recognition (OCR)**.

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

---

## Goals / Roadmap

* Integrate multiple smaller PDF handling & AI components into one app
* Add **PDF text extraction** and **OCR** for scanned images
* Connect with **generative AI** for summarization and Q\&A
* Make the interface **responsive and user-friendly**
* Add **session saving** so users can return to previous PDFs and chats

---

## Notes

* This project is very much a **work in progress**.
* Feedback, suggestions, or contributions are welcome!

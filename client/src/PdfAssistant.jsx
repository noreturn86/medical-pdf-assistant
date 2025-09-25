import { useState } from 'react';
import { pdfjs } from 'react-pdf';
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import axios from 'axios';

import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;


export default function PdfAssistant() {
    const [pdfUrl, setPdfUrl] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingSummary, setLoadingSummary] = useState(false);
    const [extractedText, setExtractedText] = useState('');
    const [summarizedText, setSummarizedText] = useState('');

    async function handleFileChange(e) {
        const pdfFile = (e.target.files?.[0]);

        if (pdfFile && pdfFile.type !=="application/pdf"){
            setError("Please upload a valid pdf file.");
            return;
        }

        setSummarizedText('');
        setLoading(true);

        try {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }

            setPdfUrl(URL.createObjectURL(pdfFile));

            const extracted = await extractTextFromFile(pdfFile);
            
            //if no text extracted, try again with ocr method
            if (extracted.length !== 0){
              const summary = await summarizePdfText(extracted);
              setSummarizedText(summary);
            } else {
              const extractedOcr = await extractTextOcr(pdfFile);
              const summary = await summarizePdfText(extractedOcr);
              setSummarizedText(summary);
            }

        } catch (err) {
            console.error(err);
            setError(err?.message || String(err));
        } finally {
            setLoading(false);
        }
    }


    async function extractTextFromFile(file) {
        const arrayBuffer = await file.arrayBuffer();
        const uint8 = new Uint8Array(arrayBuffer);
        const pdf = await pdfjsLib.getDocument({ data: uint8 }).promise;

        let allText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const pageText = content.items.map(item => item.str || "").join(" ");
            allText += pageText + "\n";
        }
        setExtractedText(allText.trim());
        return allText.trim();
    }


    async function extractTextOcr(file) {

      if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }

      setPdfUrl(URL.createObjectURL(file));


      try {
        const res = await axios.post("http://localhost:5000/api/extractOcr", {
          pdfUrl
        });
        console.log(res.data.fullText);
      } catch (err) {
        console.error(err);
            alert("Failed to get answer from server.");
      }
    }

    async function summarizePdfText(text) {
        setLoadingSummary(true);
        try {
            const res = await axios.post("http://localhost:5000/api/summarize", {
                text
            });
            return res.data.summary;
        } catch (err) {
            console.error(err);
            alert("Failed to get answer from server.");
            return "";
        } finally {
            setLoadingSummary(false);
        }
    }


  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      

      <div className="bg-white shadow rounded-2xl p-6 border border-gray-300">
        <h2 className="text-xl font-semibold mb-4">Upload a PDF</h2>
        <input
          type="file"
          accept="application/pdf"
          className="file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-600
                     hover:file:bg-blue-100"
            onChange={handleFileChange}
            disabled={loading}
        />

        {loading && (
            <div className="absolute top-4 right-4 flex items-center space-x-2 text-gray-700">
                <svg
                    className="animate-spin h-5 w-5 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                </svg>
                <span>Loading...</span>
            </div>
        )}

        {error && (
        <div className="mt-4 p-3 rounded-xl bg-red-100 border border-red-300 text-red-700">
            {error}
        </div>
        )}

      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-2 bg-gray-50 shadow-inner rounded-2xl p-4 border border-gray-300">
          <h2 className="text-lg font-medium mb-2">PDF Preview</h2>
          <div className="overflow-y-scroll h-96 border rounded-lg flex items-center justify-center text-gray-400">

            <iframe title='pdf-preview' src={pdfUrl} className='border border-blue-600 w-full h-full'/>
            
          </div>
        </div>

        <div className="flex-1 bg-white shadow rounded-2xl p-6 border border-gray-300">
          <h2 className="text-lg font-semibold mb-2">Summary</h2>
          {loadingSummary ? (
            <div className="flex items-center space-x-2 text-gray-700">
              <svg
                className="animate-spin h-15 w-15 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              <span>Summarizing...</span>
            </div>
          ) : (
            <p className="text-gray-500 italic">{summarizedText || "Summary will appear here"}</p>
          )}
        </div>
      </div>

      <div className="bg-white shadow rounded-2xl p-6 border border-gray-300 flex flex-col h-[300px]">
        <h2 className="text-lg font-semibold mb-4">Ask questions about your document</h2>

        <div className="flex-1 overflow-y-auto space-y-3 mb-4">
          <div className="flex justify-end">
            <div className="px-4 py-2 rounded-2xl max-w-xs bg-blue-600 text-white rounded-br-none">
              User message
            </div>
          </div>
          <div className="flex justify-start">
            <div className="px-4 py-2 rounded-2xl max-w-xs bg-gray-200 text-gray-800 rounded-bl-none">
              AI response
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type your question..."
            className="flex-1 border rounded-xl p-3 focus:ring-2 focus:ring-blue-400"
          />
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-500 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

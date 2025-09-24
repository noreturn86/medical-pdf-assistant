import PdfAssistant from "./PdfAssistant";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-md p-4">
        <h1 className="text-2xl font-bold text-center">
          Medical PDF Assistant
        </h1>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <PdfAssistant />
      </main>
    </div>
  );
}

export default App;

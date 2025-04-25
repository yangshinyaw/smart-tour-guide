import React from 'react';
import html2pdf from 'html2pdf.js';

const PDFExporter = ({ targetRefId }) => {
  const handleExport = () => {
    const element = document.getElementById(targetRefId);

    const opt = {
      margin:       0.5,
      filename:     'SmartTourGuide-Itinerary.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <button
      onClick={handleExport}
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded mt-4"
    >
      Export to PDF
    </button>
  );
};

export default PDFExporter;

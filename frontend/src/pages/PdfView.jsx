import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";

// PDF Viewer imports
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

// PDF styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const PdfView = () => {
  const { noteId } = useParams();
  const location = useLocation();
  const [note, setNote] = useState(location.state?.note || null);
  const [loading, setLoading] = useState(!note);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    if (!note) {
      const fetchNote = async () => {
        try {
          const { data } = await axios.get(`/api/notes/${noteId}`);
          setNote(data);
        } catch (err) {
          console.error("Failed to load note", err);
        } finally {
          setLoading(false);
        }
      };
      fetchNote();
    }
  }, [noteId, note]);

  if (loading) return <div className="text-center mt-8">Loading note...</div>;
  if (!note?.fileUrl) return <div className="text-center mt-8 text-red-500">Failed to load note.</div>;

  const fileType = note.fileType?.toLowerCase();

  return (
    <div className="h-screen px-4 pt-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">{note.title}</h2>
        <p className="text-sm text-gray-500">
          Type: {fileType.toUpperCase()} | Uploaded: {new Date(note.createdAt).toLocaleString()}
        </p>
      </div>

      <div className="border h-[90%] rounded-lg overflow-hidden shadow flex items-center justify-center bg-gray-100">
        {fileType === "pdf" ? (
          <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
            <Viewer fileUrl={note.fileUrl} plugins={[defaultLayoutPluginInstance]} />
          </Worker>
        ) : ["jpg", "jpeg", "png", "webp"].includes(fileType) ? (
          <img src={note.fileUrl} alt="Note" className="max-h-full max-w-full object-contain" />
        ) : (
          <div className="text-red-500 text-center">Unsupported file type: {fileType}</div>
        )}
      </div>
    </div>
  );
};

export default PdfView;

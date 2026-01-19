'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MangaProject, GeneratedManga } from '@/lib/types';
import { loadProject } from '@/lib/services/storage-service';

export default function PreviewPage() {
  const router = useRouter();
  const [project, setProject] = useState<MangaProject | null>(null);
  const [exportPages, setExportPages] = useState<GeneratedManga[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const saved = await loadProject('default');
        if (saved) {
          const normalizedProject = {
            ...saved,
            sessions: Array.isArray(saved.sessions) ? saved.sessions : [],
            pages: Array.isArray(saved.pages) ? saved.pages : []
          };
          setProject(normalizedProject);
          setExportPages(normalizedProject.pages.filter(p => p.markedForExport));
        }
      } catch (err) {
        console.error("Failed to load project", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-zinc-800">Loading preview...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white overflow-y-auto z-50">
      <div className="min-h-full p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-12 export-container">
          <div className="flex justify-between items-center print:hidden border-b border-zinc-200 pb-6 mb-8">
            <div>
              <h1 className="text-4xl font-manga text-black">
                {project?.title || 'Manga Preview'}
              </h1>
              <p className="text-zinc-500 text-sm mt-1 font-manga">
                Ready for PDF Export - {exportPages.length} pages marked
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => window.print()}
                className="px-8 py-3 bg-amber-500 text-black rounded-xl font-manga font-bold shadow-lg hover:bg-amber-400 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={exportPages.length === 0}
              >
                <span>DOWNLOAD PDF</span>
              </button>
              <button
                onClick={() => router.push('/studio')}
                className="px-6 py-3 border border-zinc-300 rounded-xl text-zinc-600 font-manga font-bold hover:bg-zinc-50 transition-all"
              >
                BACK TO STUDIO
              </button>
            </div>
          </div>

          <div className="space-y-16 print:space-y-0">
            {exportPages.map((page, idx) => (
              <div key={page.id} className="page-break flex flex-col items-center">
                <div className="w-full bg-white shadow-2xl print:shadow-none border border-zinc-100 print:border-none">
                  <img src={page.url || "/placeholder.svg"} alt={`Page ${idx + 1}`} className="w-full h-auto block" />
                </div>
                <div className="mt-4 text-center text-zinc-400 font-manga text-xl print:pb-8">
                  — PAGE {idx + 1} —
                </div>
              </div>
            ))}
          </div>

          {exportPages.length === 0 && (
            <div className="text-center py-40">
              <div className="text-zinc-300 font-manga text-3xl font-bold mb-4">
                NO PAGES MARKED FOR EXPORT
              </div>
              <p className="text-sm text-zinc-400 font-manga">
                Mark pages with the PDF icon in the studio sidebar
              </p>
              <button
                onClick={() => router.push('/studio')}
                className="mt-6 px-6 py-3 bg-amber-500 text-black rounded-xl font-manga font-bold hover:bg-amber-400 transition-all"
              >
                GO TO STUDIO
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body {
            background: white !important;
            color: black !important;
            margin: 0;
            padding: 0;
          }
          .print\\:hidden { 
            display: none !important; 
          }
          .page-break {
            page-break-after: always;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 0;
          }
          img {
            max-height: 90vh;
            width: auto;
            margin: 0 auto;
          }
          .export-container {
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}


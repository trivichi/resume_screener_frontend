import React, { useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from './components/Hero';
import UploadSection from './components/UploadSection';
import ResultsDashboard from './components/results/ResultsDashboard';
import LoadingOverlay from './components/LoadingOverlay';
import { API_URL } from './config';
import './App.css';

// Lazy load heavy 3D background component
const AnimatedBackground = lazy(() => import('./components/AnimatedBackground'));

function App() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState('hero');
  const [error, setError] = useState(null);

  const handleStartScreening = () => {
    setStage('upload');
    setError(null);
  };

  const handleAnalyze = async (uploadedResumes, jobDesc) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      uploadedResumes.forEach(file => {
        formData.append('files', file);
      });

      const uploadResponse = await fetch(`${API_URL}/batch-upload`, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(`Upload failed: ${errorData.detail || 'Unknown error'}`);
      }

      const uploadData = await uploadResponse.json();

      if (uploadData.successful === 0) {
        throw new Error('No files were successfully uploaded');
      }

      const matchFormData = new FormData();
      matchFormData.append('job_description', jobDesc);

      const matchResponse = await fetch(`${API_URL}/match`, {
        method: 'POST',
        body: matchFormData,
      });

      if (!matchResponse.ok) {
        const errorData = await matchResponse.json();
        throw new Error(`Matching failed: ${errorData.detail || 'Unknown error'}`);
      }

      const matchData = await matchResponse.json();

      if (matchData.shortlisted_candidates.length === 0) {
        throw new Error('No candidates were analyzed successfully');
      }

      setResults(matchData);
      setStage('results');
      
    } catch (error) {
      setError(error.message);
      alert(`Error: ${error.message}\n\nPlease check:\n1. Backend is running on port 8000\n2. Resumes are valid PDF files\n3. Job description is not empty`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      await fetch(`${API_URL}/resumes`, {
        method: 'DELETE',
      });
    } catch {
      // no console logs
    }
    
    setStage('hero');
    setResults(null);
    setError(null);
  };

  return (
    <div className="relative min-h-screen overflow-hidden ">
      <Suspense fallback={null}>
        <AnimatedBackground />
      </Suspense>
      
      <AnimatePresence mode="wait">
        {stage === 'hero' && (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Hero onStart={handleStartScreening} />
          </motion.div>
        )}

        {stage === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <UploadSection onAnalyze={handleAnalyze} onBack={handleReset} />
          </motion.div>
        )}

        {stage === 'results' && results && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <ResultsDashboard results={results} onReset={handleReset} />
          </motion.div>
        )}
      </AnimatePresence>

      {loading && <LoadingOverlay />}

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500/90 backdrop-blur-xl text-white px-6 py-4 rounded-xl shadow-2xl max-w-md z-50">
          <div className="flex items-start gap-3">
            <div className="text-2xl">⚠️</div>
            <div>
              <h4 className="font-bold mb-1">Error</h4>
              <p className="text-sm">{error}</p>
            </div>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-white/70 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

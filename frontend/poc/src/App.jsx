import { useState, useRef, useEffect } from 'react';
import './App.css';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js';

function App() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [originalAudioUrl, setOriginalAudioUrl] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [reducedImage, setReducedImage] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
  const wsRegionsRef = useRef(null);

  useEffect(() => {
    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
    };
  }, []);

  function handleFileChange(e) {
    const selectedFile = e.target.files[0];

    setStatus('idle');
    setErrorMessage('');
    setSelectedRegion(null);

    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }
    if (originalAudioUrl) {
      URL.revokeObjectURL(originalAudioUrl);
    }

    if (selectedFile) {
      const fileName = selectedFile.name.toLowerCase();
      if (!fileName.endsWith('.wav') && !fileName.endsWith('.mp3') && !fileName.endsWith('.m4a')) {
        setErrorMessage('Invalid file type. Please upload a .wav, .mp3, or .m4a file.');
        setFile(null);
        setOriginalAudioUrl(null);
        if (wavesurferRef.current) {
          wavesurferRef.current.destroy();
          wavesurferRef.current = null;
        }
        return;
      }

      setFile(selectedFile);
      const newAudioUrl = URL.createObjectURL(selectedFile);
      setOriginalAudioUrl(newAudioUrl);

      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
        wavesurferRef.current = null;
      }

      const wavesurfer = WaveSurfer.create({
        container: waveformRef.current,
      });
      wavesurferRef.current = wavesurfer;

      const wsRegions = wavesurfer.registerPlugin(RegionsPlugin.create());
      wsRegionsRef.current = wsRegions;

      wsRegions.on('region-updated', (region) => {
        setSelectedRegion({ start: region.start, end: region.end });
      });
      wsRegions.on('region-created', (region) => {
        setSelectedRegion({ start: region.start, end: region.end });
      });

      wavesurfer.load(newAudioUrl);

      wavesurfer.on('interaction', () => {
        wavesurfer.play();
      });

    } else {
      setFile(null);
      setOriginalAudioUrl(null);
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
        wavesurferRef.current = null;
        wsRegionsRef.current = null;
      }
    }
  }

  const handleAddRegion = () => {
    if (!wsRegionsRef.current || !wavesurferRef.current) return;

    // Clear existing regions to keep only one
    wsRegionsRef.current.clearRegions();

    const duration = wavesurferRef.current.getDuration();
    const start = duration * 0.1;
    const end = Math.min(duration * 0.9, start + 5);

    wsRegionsRef.current.addRegion({
      start: start,
      end: end,
      color: 'rgba(100, 108, 255, 0.2)',
      drag: true,
      resize: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage('Please select a file first.');
      return;
    }

    setStatus('processing');
    setErrorMessage('');

    const formData = new FormData();
    formData.append('file', file);
    if (selectedRegion) {
      formData.append('startTime', selectedRegion.start);
      formData.append('endTime', selectedRegion.end);
    }

    try {
      const response = await fetch('http://localhost:5000/process-audio', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to process audio');
      }

      const data = await response.json();

      setOriginalImage(data.original_image);
      setReducedImage(data.reduced_image);

      // Convert audio base64 string to Blob
      const byteCharacters = atob(data.audio);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const audioBlob = new Blob([byteArray], { type: 'audio/wav' });

      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
      const url = URL.createObjectURL(audioBlob);
      setDownloadUrl(url);

      setStatus('success');

    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || "Error processing file.");
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-p">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-primary text-surface px-6 py-4 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">Audio Analysis POC</h1>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-6 space-y-6 mt-20">
        <section className="bg-surface p-6 rounded-xl shadow-sm border border-border">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-text-s">Upload Audio File</label>
              <input
                type="file"
                accept=".wav,.mp3,.m4a"
                onChange={handleFileChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-secondary file:text-text-p hover:file:bg-border cursor-pointer text-text-s w-full"
              />
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              {file && (
                <button
                  type="button"
                  onClick={handleAddRegion}
                  className="px-4 py-2 bg-secondary text-text-p rounded-md font-medium hover:bg-border transition-colors border border-border shadow-sm"
                >
                  Select Audio Portion
                </button>
              )}
              <button
                type="submit"
                disabled={!file || status === 'processing'}
                className="px-6 py-2 bg-primary text-surface rounded-md font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {status === 'processing' ? 'Processing...' : 'Upload & Clean'}
              </button>
            </div>
          </form>

          {errorMessage && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-md border border-red-200 text-sm">
              {errorMessage}
            </div>
          )}
        </section>

        <section className={`bg-surface p-6 rounded-xl shadow-sm border border-border transition-opacity ${file ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
          <h2 className="text-lg font-semibold mb-4 text-text-p">Waveform Visualization</h2>
          <div ref={waveformRef} className="w-full rounded-lg bg-background border border-border overflow-hidden" style={{ minHeight: '128px' }}></div>
        </section>

        {status === 'success' && downloadUrl && (
          <section className="bg-surface p-6 rounded-xl shadow-sm border border-border space-y-6">
            <h2 className="text-xl font-bold text-text-p border-b border-border pb-2">Results</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-primary flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
                  Original Audio
                </h3>
                <audio controls src={originalAudioUrl} className="w-full h-10 rounded" />
                {originalImage && (
                  <div className="rounded-lg overflow-hidden border border-border bg-background flex items-center justify-center p-2">
                    <img src={`data:image/png;base64,${originalImage}`} alt="Original Waveform" className="w-full object-contain max-h-48" />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-highlight flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-highlight inline-block"></span>
                  Reduced Noise
                </h3>
                <audio controls src={downloadUrl} className="w-full h-10 rounded" />
                {reducedImage && (
                  <div className="rounded-lg overflow-hidden border border-border bg-background flex items-center justify-center p-2">
                    <img src={`data:image/png;base64,${reducedImage}`} alt="Reduced Waveform" className="w-full object-contain max-h-48" />
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 flex justify-center">
              <a
                href={downloadUrl}
                download={`noisereduce_${file.name}`}
                className="inline-flex items-center justify-center px-8 py-3 bg-primary text-surface font-semibold rounded-full hover:opacity-90 transition-opacity shadow-md hover:shadow-lg"
              >
                Download Cleaned Audio
              </a>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
import { useState } from 'react';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [originalAudioUrl, setOriginalAudioUrl] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [reducedImage, setReducedImage] = useState(null);

  function handleFileChange(e) {
    const selectedFile = e.target.files[0];

    setStatus('idle');
    setErrorMessage('');

    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }
    if (originalAudioUrl) {
      URL.revokeObjectURL(originalAudioUrl);
    }

    if (selectedFile) {
      if (!selectedFile.name.toLowerCase().endsWith('.wav')) {
        setErrorMessage('Invalid file type. Please upload a .wav file.');
        setFile(null);
        setOriginalAudioUrl(null);
        return;
      }

      setFile(selectedFile);
      setOriginalAudioUrl(URL.createObjectURL(selectedFile));
    } else {
      setFile(null);
      setOriginalAudioUrl(null);
    }
  }

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
    <div className="container">
      <h1>Audio Analysis POC</h1>
      <p>Upload a <b>.wav</b> file</p>

      <div className="upload-section">
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept=".wav"
            onChange={handleFileChange}
          />
          <button type="submit" disabled={!file || status === 'processing'}>
            {status === 'processing' ? 'Processing...' : 'Upload & Clean'}
          </button>
        </form>

        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}
      </div>

      {status === 'success' && downloadUrl && (
        <div className="results-section">

          <div className="results-grid">
            <div className="result-card">
              <h3>Original</h3>
              <audio controls src={originalAudioUrl} />
              {originalImage && <img src={`data:image/png;base64,${originalImage}`} alt="Original Waveform" />}
            </div>

            <div className="result-card">
              <h3>Reduced Noise</h3>
              <audio controls src={downloadUrl} />
              {reducedImage && <img src={`data:image/png;base64,${reducedImage}`} alt="Reduced Waveform" />}
            </div>

            <div className="full-width" style={{ textAlign: 'center', marginTop: '1rem' }}>
              <a
                href={downloadUrl}
                download={`noisereduce_${file.name}`}
                className="download-btn"
              >
                Download Cleaned Audio
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
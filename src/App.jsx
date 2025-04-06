import { useState } from 'react'
import './App.css'

function App() {
  // State Variables
  const [longUrl, setLongUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [copyButtonText, setCopyButtonText] = useState('Copy');

  // Form Submission Handler
  const handleSubmit = async (event) => {
    event.preventDefault();
    setShortUrl('');
    setErrorMessage('');
    setLoading(true);

    const requestBody = { longUrl };
    if (customAlias.trim()) {
      requestBody.customAlias = customAlias;
    }
    try {
      const response = await fetch('/api/urls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Error: ${response.status} ${response.statusText}`);
      }

      setShortUrl(data.shortUrl);
    } catch (err) {
      setErrorMessage(errorMessage.message || 'Failed to shorten URL. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Copy to Clipboard Handler
  const handleCopy = async() => {
    if (!shortUrl) {
      return;
    }
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopyButtonText('Copied!');
      setTimeout(() => {
        setCopyButtonText('Copy');
      }, 2000);
    } catch (err) {
      console.error('Failed to copy URL: ', err);
      setErrorMessage('Failed to copy URL to clipboard.');
    }
  }

  return (
    <div className="App">
      <h1>URL Shortener</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="longUrlInput">Paste your long link here</label>
          <input
            type="url"
            id="longUrlInput"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="https://example.com/your-long-url"
            required
            style={{ width: '100%', padding: '5px', marginBottom: '5px' }}
          />
        </div>

        <div style={{ marginTop: '10px' }}>
          <label htmlFor="customAliasInput">Customise your link</label>
          <input
            type="text"
            id="customAliasInput"
            value={customAlias}
            onChange={(e) => setCustomAlias(e.target.value)}
            placeholder="Enter alias (optional)"
            style={{ width: '150px', padding: '5px', marginLeft: '15px' }}
          />
        </div>

        <button type="submit" style={{ marginTop: '15px', padding: '10px 20px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '5px' }} disabled={loading}>
          {loading ? 'Shortening...' : 'Shorten URL'}
        </button>
      </form>

      <div style={{ marginTop: '20px' }}>
        {loading && <p>Loading...</p>}
        {errorMessage && <p style={{ color: 'red' }}>Error: {errorMessage}</p>}
        {shortUrl && !loading && (
          <div>
            <p>Short URL created!</p>
            <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a>
            <button
              onClick={handleCopy}
              style={{ marginLeft: '10px', padding: '5px 10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
              disabled={copyButtonText === 'Copied!'}
            >
              {copyButtonText}
            </button>
          </div>
        )}
      </div>
      <footer style={{ marginTop: '20px', fontSize: '12px', color: '#555' }}>
        URL Shortener v1.0.0 • <a href="https://github.com/ernestkck/url-shortener" target="_blank" rel="noopener noreferrer">View on GitHub</a>
      </footer>
    </div>
  );
}

export default App

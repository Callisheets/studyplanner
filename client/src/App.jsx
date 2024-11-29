import React, { useEffect, useState } from 'react';

function App() {
    const [backendData, setBackendData] = useState([{}]);

    useEffect(() => {
      fetch('http://localhost:5000/api')
          .then(response => {
              if (!response.ok) {
                  return response.text().then(text => { // Get error response body
                      throw new Error(`Network response was not ok: ${response.status} - ${text}`);
                  });
              }
              return response.json();
          })
          .then(data => {
              setBackendData(data);
          })
          .catch(error => {
              console.error('Error fetching data:', error);
          });
  }, []);

    return (
        <div>
            <h1>Welcome to the App</h1>
            {/* Render your backend data or other components here */}
        </div>
    );
}

export default App;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ComicForm from './components/ComicForm';
import ComicStrip from './components/ComicStrip';
import './App.css'; // Import the CSS file

const App = () => {
  const [textInputs, setTextInputs] = useState(Array(10).fill(''));
  const [comicImages, setComicImages] = useState([]);

  useEffect(() => {
    setComicImages([]);
  }, [textInputs]);

  const query = async (data) => {
    try {
      const response = await axios.post(
        'https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud',
        {
          inputs: Object.values(data),
        },
        {
          headers: {
            Accept: 'image/png',
            Authorization: 'Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM',
            'Content-Type': 'application/json',
          },
          responseType: 'blob',
        }
      );
      return response.blob();
    } catch (error) {
      console.error('API Error:', error);
      throw new Error('API Error'); // Handle errors
    }
  };

  const generateComic = async () => {
    try {
      const blobs = await Promise.all(textInputs.map((text) => query(text)));

      const imageUrls = blobs.map((blob) => URL.createObjectURL(new Blob([blob])));
      setComicImages(imageUrls);
    } catch (error) {
      console.error('Comic Generation Error:', error);
      // Handle errors here
    }
  };

  return (
    <div className="container">
      <h1>Comic Creator</h1>
      <ComicForm textInputs={textInputs} onFormSubmit={generateComic} />
      <div id="comic-strip">
        <ComicStrip images={comicImages} />
      </div>
    </div>
  );
};

export default App;

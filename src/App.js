import React, { useState } from 'react';
import yaml from 'js-yaml';
import DynamicForm from './component/DynamicForm';
import Alert from './utilities/Alert';
import { MdOutlineClear } from 'react-icons/md';


const FileUpload = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [convertedJSON, setConvertedJSON] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        setTimeout(() => {
          setIsLoading(false);
          setIsCompleted(true);
        }, 1000)

        try {
          const parsedJSON = yaml.load(content);
          setConvertedJSON(parsedJSON);
        } catch (error) {
          console.error('Error parsing YAML:', error);
          setError(error)
          setConvertedJSON(null);
        }
      };

      reader.readAsText(file);
    }
  };

  const clearUpload = () => {
    setIsCompleted(false);
    document.getElementById('fileInput').value = '';
    setError(null)
    setConvertedJSON(null);
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-semibold mb-4 text-primary">Form Generator</h1>
      </div>
      <div className="mb-4">
        {isLoading && !isCompleted ? (
          <div className="bg-blue-500 text-white p-2 rounded-full">
            Uploading...
          </div>
        ) : isCompleted ? (
          <div className='flex gap-2'>
            <button
              className="bg-green-500 text-white p-2 rounded-full"
            >
              Uploaded
            </button>
            <button
              className="bg-red-500 text-white p-2 rounded-full"
              onClick={clearUpload}
            >
              <MdOutlineClear />
            </button>
          </div>
        ) : (
          <label
            htmlFor="fileInput"
            className="cursor-pointer bg-blue-500 text-white p-2 rounded-full hover:bg-blue-700"
          >
            Upload YAML File
          </label>
        )}
        <input
          type="file"
          accept=".yaml"
          onChange={handleFileUpload}
          className="hidden"
          id="fileInput"
        />
      </div>
      {error ? <div className="container mx-auto mt-5">
        <Alert type="danger" message={error} />
      </div> : null}
      {convertedJSON && !isLoading && <DynamicForm convertedJSON={convertedJSON} />}
    </div>
  );
};

export default FileUpload;



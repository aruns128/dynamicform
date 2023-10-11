
import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'



export default function DynamicForm({ convertedJSON }) {
  const config = convertedJSON;
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (e.target.type === "checkbox") {
      const currentValue = formData[name] || [];
      const updatedValue = e.target.checked
        ? [...currentValue, value]
        : currentValue.filter((item) => item !== value);

      setFormData(prev => ({ ...prev, [name]: updatedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    let validationErrors = {};

    config.sections.forEach(section => {
      section.questions.forEach(question => {
        if (question.validation) {
          const pattern = new RegExp(question?.validation.pattern);
          if (question.validation.required && !formData[question.id]) {
            validationErrors[question.id] = "This field is required.";
          } else {
            if (pattern.test(formData[question.id])) {
              if (formData[question.id].length < question?.validation.minLength || formData[question.id] > question?.validation.maxLength) {
                validationErrors[question.id] = question?.validation.message || `Text length should be between  ${question?.validation.minLength} and ${question?.validation.maxLength} characters and contain only alphanumeric characters.`;
              }
            } else {
              validationErrors[question.id] = "This field only accepts alphanumeric characters.";
            }
          }
        }
      });
    });



    if (Object.keys(validationErrors).length === 0) {
      axios.post(`http://localhost:5000/api/formdata`, { formData })
        .then(response => {
          console.log("Data submitted successfully:", response.data);
          toast.success('Data submitted successfully', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });

        })
        .catch(error => {
          console.error("Error submitting data:", error);
          toast.error('Error submitting data', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        });
      setErrors({});
    } else {
      setErrors(validationErrors);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className='bg-opacity-25 w-full h-screen pr-20 pl-20 '>
        {config &&
          <>
            <div className='flex items-center justify-center font-semibold text-2xl border-solid border-2 border-bottom-none border-black'>
              <h1>{config?.title}</h1>
            </div>
            {config?.sections.map((section) => (
              <div key={section.title} className='border-solid border-2 border-black border-t-0'>
                <div className='font-semibold text-xl pb-4 pt-4'>
                  <h2>{section.title}</h2>
                </div>
                {section.questions.map((question, index) => (
                  <div key={question.id} className="flex mt-2 mb-2  pl-2">
                    <div className='w-2/4'><label className="font-semibold text-lg mr-2">{`${index + 1}.  ${question.text}`} <span className="text-red-600">{question?.validation && question?.validation.required ? "*" : null}</span></label></div>
                    <div className="flex w-2/4 flex-col">
                      {question.type === 'text' && (
                        <input
                          name={question.id}
                          className="w-3/4 focus:bg-white border rounded px-2 py-1"
                          type="text"
                          placeholder={question.placeholder || ""}
                          value={formData[question.id] || ''}
                          onChange={handleInputChange}
                        />
                      )}
                      {question.type === "date" && (
                        <input
                          type="date"
                          name={question.id}
                          className="w-48 p-2 border rounded"
                          placeholder={question.placeholder || ""}
                          value={formData[question.id] || ''}
                          onChange={handleInputChange}
                        />
                      )}
                      {question.type === 'number' && (
                        <input
                          name={question.id}
                          className="w-3/4 focus:bg-white border rounded px-2 py-1"
                          type="number"
                          value={formData[question.id] || ''}
                          onChange={handleInputChange}
                        />
                      )}
                      {question.type === 'textarea' && (
                        <textarea
                          className="w-3/4 focus:bg-white border rounded px-2 py-1"
                          rows={3}
                          placeholder={question.placeholder || ""}
                          name={question.id}
                          value={formData[question.id] || ''}
                          onChange={handleInputChange}
                        />
                      )}
                      {question.type === 'radio' && question.options.map((option) => (
                        <div key={`${question.id}_${option.label}`} className="ml-4 space-x-2">
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name={question.id}
                              value={option.value}
                              id={`${question.id}_${option.label}`}
                              checked={formData[question.id] === option.value}
                              onChange={handleInputChange}
                              className="accent-indigo-600"
                            />
                            <span className="ml-2">{option.label}</span>
                          </label>

                        </div>
                      ))}
                      {question.type === 'checkbox' && question.options?.map((option) => (
                        <div key={`${question.id}_${option.label}`} className="ml-4 space-x-2">
                          <label className="inline-flex items-center">
                            <input
                              type="checkbox"
                              name={question.id}
                              value={option.value}
                              checked={formData[question.id]?.includes(option.value) || false}
                              onChange={handleInputChange}
                              id={`${question.id}_${option.label}`}
                              className="accent-indigo-600"
                            />
                            <span className="ml-2">{option.label}</span>
                          </label>
                        </div>
                      ))}
                      {question.type === 'select' && (
                        <select
                          name={question.id}
                          value={formData[question.id] || ""}
                          onChange={handleInputChange}
                          className="w-48 p-2 border rounded ml-4"
                        >
                          <option value="">Select {question.label}</option>
                          {question.options?.map((option) => (
                            <option key={option.label} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      )}
                      {errors[question.id] ? <p className="text-red-600">{errors[question.id]}</p> : null}
                    </div>
                  </div>
                ))}
              </div>
            ))}
            <div className='flex items-end justify-end mt-4 pb-20 '>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Submit
              </button>
            </div>
          </>}
      </form>
      <ToastContainer />
    </>
  );
}

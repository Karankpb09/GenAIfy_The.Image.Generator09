import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { preview } from '../assets';
import { getRandomPrompt } from '../utils';
import { FormField, Loader } from '../components';

const divStyle = {
  marginLeft: '100px',
};

const CreatePost = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    prompt: '',
    photo: '',
  });

  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };

  const handleClick = () => {
    window.location.href = 'https://www.facebook.com';
  };

  async function generateImage() {
    if (form.prompt) {
      try {
        setGeneratingImg(true);
        const response = await fetch(
          'http://localhost:8080/api/v1/stability/generate-image', // Updated endpoint
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              prompt: form.prompt,
            }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Image generation failed: ${errorText}`);
        }

        // Handle the response based on what your backend is sending
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          setForm({ ...form, photo: data.image }); // Assuming JSON with base64
        } else if (contentType && contentType.includes('image/')) {
          const blob = await response.blob();
          const imageUrl = URL.createObjectURL(blob);
          setForm({ ...form, photo: imageUrl }); // Handling raw image data
        } else {
          throw new Error('Unexpected response format from the backend');
        }
      } catch (error) {
        alert(error.message || 'Something went wrong');
      } finally {
        setGeneratingImg(false);
      }
    } else {
      alert('Please provide a proper prompt');
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.prompt && form.photo) {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/v1/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...form }),
        });

        await response.json();
        alert('Success');
        navigate('/');
      } catch (err) {
        alert(err);
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please generate an image with proper details');
    }
  };

  return (
    <section className="max-w-7xl mx-auto">
      <div style={divStyle}>
        <h1 className="font-extrabold text-white text-[32px]">Create</h1>
        <p className="mt-2 text-[#3f5687] text-[18px] max-w-[500px]">
          Generate an imaginative image through GenAIfy AI and share it with the
          community
        </p>
      </div>

      <form className="mt-14 max-w-3xl" onSubmit={handleSubmit}>
        <div style={divStyle} className="flex flex-col gap-5">
          <FormField
            labelName="Your Name"
            type="text"
            name="name"
            placeholder="Ex., Karan or Aditya"
            value={form.name}
            handleChange={handleChange}
          />

          <FormField
            labelName="Prompt"
            type="text"
            name="prompt"
            placeholder="An Impressionist oil painting of sunflowers in a purple vase…"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            isPromtify
            handleSurpriseMe={handleSurpriseMe}
          />

          <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-1 h-64 flex justify-center items-center">
            {form.photo ? (
              <img
                src={form.photo}
                alt={form.prompt}
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={preview}
                alt="preview"
                className="w-9/12 h-9/12 object-contain opacity-40"
              />
            )}

            {generatingImg && (
              <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                <Loader />
              </div>
            )}
          </div>
        </div>

        <div style={divStyle} className="mt-5 flex gap-5">
          <button
            type="button"
            onClick={generateImage}
            className="text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {generatingImg ? 'Generating...' : 'Generate'}
          </button>
        </div>

        <div style={divStyle} className="mt-10">
          <p className="mt-2 text-[#3f5687] text-[16px]">
            *** Once you have created the image if you want, you can share it
            with others in the community ***
          </p>
          <button
            type="submit"
            className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {loading ? 'Sharing...' : 'Share with the Community'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;
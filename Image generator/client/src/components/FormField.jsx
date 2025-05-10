import React from 'react';

const FormField = ({
  labelName,
  type,
  name,
  placeholder,
  value,
  handleChange,
  isSurpriseMe,
  handleSurpriseMe,
  isPromtify,
  handlePromtify,

  handleClick,
}) => (
  <div>
    <div className="flex items-center gap-2 mb-2 ">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-white"
      >
        {labelName}
      </label>
      {isSurpriseMe && (
        <button
          type="button"
          onClick={handleSurpriseMe}
          className="font-semibold text-xs bg-[#3f5687] py-1 px-3 rounded-[5px] text-black"
        >
          Surprise me
        </button>
      )}
      {isPromtify && (
        <button
          type="button"
          onClick={() => window.open("http://localhost:5173/", '_blank')}
          className="font-semibold text-xs bg-[#3f5687] py-1 px-3 rounded-[5px] text-black"
        >
          Promtify
        </button>
      )}
      
    
       
      

     
    </div>
    
    <input
      type={type}
      id={name}
      name={name}
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#6469ff] focus:border-[#6469ff] outline-none block w-full p-3"
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      required
    />
  </div>
  
);

export default FormField;

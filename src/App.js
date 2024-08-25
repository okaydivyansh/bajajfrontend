import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Select } from "antd";
import API from "./consts";
import axios from "axios";

function App() {
  return (
    <>
      <JsonInputComponent />
    </>
  );
}

export default App;

const JsonInputComponent = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [parsedData, setParsedData] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [apiData, setApiData] = useState(null);
  const handleInputChange = (e) => {
    setJsonInput(e.target.value);
  };
  const handleSubmit = (e) => {
    setShowOptions(false);
    e.preventDefault();
    try {
      const parsed = JSON.parse(jsonInput);
      setParsedData(parsed);
      handleAPI(parsed);
    } catch (error) {
      toast.error("Invalid JSON. Please check your input and try again.");
    }
  };

  const handleAPI = async (data) => {
    console.log(data);
    axios
      .post(`https://bajajbackend-five.vercel.app/bfhl`, data)
      .then((res) => {
        console.log(res);
        toast.success("Data sent to the API successfully.");
        setApiData(res.data);
        setShowOptions(true);
      })
      .catch((error) => {
        console.error(error);
        toast.error("An error occurred while sending data to the API.");
      });
  };

  return (
    <div className="flex justify-center items-center w-full h-screen flex-col">
      <Toaster />
      <div className="p-6 max-w-md mx-auto bg-white rounded-xl">
        <h3 className="text-xl font-bold text-gray-900">API Input</h3>
        <form onSubmit={handleSubmit}>
          <textarea
            value={jsonInput}
            onChange={handleInputChange}
            rows="6"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder='{"data": ["A", "C", "z"]}'
          />
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </form>
      </div>
      {showOptions && (
        <div>
          <MultiSelectComponent data={apiData} />
        </div>
      )}
    </div>
  );
};

const MultiSelectComponent = ({ data }) => {
  // All options for the multi-select component
  const options = ["Alphabets", "Numbers", "Highest Lowest Alphabet"];

  // State to manage selected options
  const [selectedOptions, setSelectedOptions] = useState([]);

  // Handle change in selected options
  const handleSelectionChange = (e) => {
    setSelectedOptions(e);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl ">
      <h3 className="text-xl font-bold text-gray-900">Select Options</h3>
      <div>
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          placeholder="Please select"
          onChange={handleSelectionChange}
        >
          {options.map((option) => (
            <Select.Option key={option} value={option}>
              {option}
            </Select.Option>
          ))}
        </Select>
      </div>

      <div className="mt-4">
        <h3>Filtered Response:</h3>
        {
          // Display the filtered data based on the selected options
          selectedOptions.includes("Numbers") && (
            <div className="flex gap-4">
              <h4>Numbers: </h4>
              {data?.numbers?.map((number) => (
                <p>{number} </p>
              ))}
            </div>
          )
        }

        {
          // Display the filtered data based on the selected options
          selectedOptions.includes("Alphabets") && (
            <div className="flex gap-4">
              <h4>Alphabets : </h4>
              {data?.alphabets?.map((alphabet) => (
                <p>{alphabet} </p>
              ))}
            </div>
          )
        }

        {
          // Display the filtered data based on the selected options
          selectedOptions.includes("Highest Lowest Alphabet") && (
            <div className="flex gap-4">
              <h4>Highest Lowest Alphabet: </h4>
              {data?.highest_lowercase_alphabet?.map((number) => (
                <p>{number} </p>
              ))}
            </div>
          )
        }
      </div>
    </div>
  );
};
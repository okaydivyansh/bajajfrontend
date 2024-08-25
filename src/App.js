import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Select } from "antd";
import API from "./consts";
import axios from "axios";

function App() {
  return (
    <>
      <JsonInput />
    </>
  );
}

export default App;

const JsonInput = () => {
  const [input, setInput] = useState("");
  const [parsedResult, setParsedResult] = useState(null);
  const [showSelection, setShowSelection] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

  const onInputChange = (event) => {
    setInput(event.target.value);
  };

  const onFormSubmit = (event) => {
    event.preventDefault();
    setShowSelection(false);
    try {
      const result = JSON.parse(input);
      setParsedResult(result);
      sendToAPI(result);
    } catch (err) {
      toast.error("Invalid JSON format. Please try again.");
    }
  };

  const sendToAPI = async (payload) => {
    console.log(payload);
    axios
      .post(`${API}/bfhl`, payload)
      .then((response) => {
        console.log(response);
        toast.success("Data successfully sent to the API.");
        setApiResponse(response.data);
        setShowSelection(true);
      })
      .catch((err) => {
        console.error(err);
        toast.error("An error occurred while communicating with the API.");
      });
  };

  return (
    <div className="flex justify-center items-center w-full h-screen flex-col">
      <Toaster />
      <div className="p-6 max-w-md mx-auto bg-white rounded-xl">
        <h3 className="text-xl font-bold text-gray-900">API Input</h3>
        <form onSubmit={onFormSubmit}>
          <textarea
            value={input}
            onChange={onInputChange}
            rows="6"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder='{"data": ["A", "B", "c"]}'
          />
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit
          </button>
        </form>
      </div>
      {showSelection && (
        <div>
          <OptionsComponent apiData={apiResponse} />
        </div>
      )}
    </div>
  );
};

const OptionsComponent = ({ apiData }) => {
  const choices = ["Alphabets", "Numbers", "Highest Lowercase Alphabet"];
  const [selectedItems, setSelectedItems] = useState([]);

  const handleSelectionChange = (selected) => {
    setSelectedItems(selected);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl">
      <h3 className="text-xl font-bold text-gray-900">Choose Options</h3>
      <div>
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          placeholder="Select options"
          onChange={handleSelectionChange}
        >
          {choices.map((choice) => (
            <Select.Option key={choice} value={choice}>
              {choice}
            </Select.Option>
          ))}
        </Select>
      </div>

      <div className="mt-4">
        <h3>Filtered Results:</h3>
        {selectedItems.includes("Numbers") && (
          <div className="flex gap-4">
            <h4>Numbers: </h4>
            {apiData?.numbers?.map((num, index) => (
              <p key={index}>{num}</p>
            ))}
          </div>
        )}

        {selectedItems.includes("Alphabets") && (
          <div className="flex gap-4">
            <h4>Alphabets: </h4>
            {apiData?.alphabets?.map((alpha, index) => (
              <p key={index}>{alpha}</p>
            ))}
          </div>
        )}

        {selectedItems.includes("Highest Lowercase Alphabet") && (
          <div className="flex gap-4">
            <h4>Highest Lowercase Alphabet: </h4>
            {apiData?.highest_lowercase_alphabet?.map((char, index) => (
              <p key={index}>{char}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

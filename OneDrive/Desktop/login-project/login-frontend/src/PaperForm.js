import React, { useState } from "react";
import axios from "axios";

function PaperForm() {
  const [paper, setPaper] = useState({
    author: "",
    domain: "",
    title: "",
    dateField: "",
    paperDesc: "",
    coAuthors: "",
    attachments: "",
    abroadRemarks: "",
    configurationAddress: "",
    forwardApproval: "",
    iprRegistration: ""
  });

  const handleChange = (e) => {
    setPaper({ ...paper, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await axios.post("http://localhost:8080/api/papers", paper);
    alert("Saved successfully ✅");
  };

  return (
    <div style={{ width: "400px", margin: "auto" }}>
      <h2>Paper Details</h2>

      {Object.keys(paper).map((key) => (
        <input
          key={key}
          name={key}
          placeholder={key}
          onChange={handleChange}
          style={{ display: "block", marginBottom: "10px", width: "100%" }}
        />
      ))}

      <button onClick={handleSubmit}>Save</button>
    </div>
  );
}

export default PaperForm;
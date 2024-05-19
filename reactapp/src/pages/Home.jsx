import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Context, server } from "../main";
import { toast } from "react-hot-toast";
import DNSItem from "../components/DNSItem";
import { Navigate } from "react-router-dom";

const Home = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [dnsRecords, setDnsRecords] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const { isAuthenticated } = useContext(Context);


  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", selectedFile);
  
    try {
      setLoading(true);
      const { data } = await axios.post(`${server}/DNS/bulk`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      toast.success(data.message);
      setLoading(false);
      setRefresh((prev) => !prev);
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  const updateHandler = async (id, editedName, editedType, editedValue) => {
    try {
      const { data } = await axios.post(
        `${server}/DNS/${id}`,
        {
          name: editedName,
          type: editedType,
          value: editedValue,
        },
        {
          withCredentials: true,
        }
      );

      toast.success(data.message);
      setRefresh((prev) => !prev);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const deleteHandler = async (id) => {
    try {
      const { data } = await axios.delete(`${server}/DNS/${id}`, {
        withCredentials: true,
      });

      toast.success(data.message);
      setRefresh((prev) => !prev);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${server}/DNS/new`,
        {
          name,
          type,
          value,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setName("");
      setType("");
      setValue("");
      toast.success(data.message);
      setLoading(false);
      setRefresh((prev) => !prev);
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    axios
      .get(`${server}/DNS/my`, {
        withCredentials: true,
      })
      .then((res) => {
        setDnsRecords(res.data.dnss);
      })
      .catch((e) => {
        toast.error(e.response.data.message);
      });
  }, [refresh]);

  if (!isAuthenticated) return <Navigate to={"/login"} />;

  return (
    <div className="container">
      <div className="login">
        <section>
          <form onSubmit={submitHandler}>
            <input
              type="text"
              placeholder="Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Type"
              required
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
            <input
              type="text"
              placeholder="Value"
              required
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />


          <input
            type="file"
            accept=".json"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            style={{ marginTop: "10px" }}
          />
          <button disabled={loading} onClick={handleFileUpload}>
            Upload File
          </button>
            <button disabled={loading} type="submit">
              Add DNS Record
            </button>


          </form>
        </section>
      </div>

      <section className="dnsContainer">
        {dnsRecords.map((record) => (
          <DNSItem
            name={record.name}
            type={record.type}
            value={record.value}
            updateHandler={updateHandler}
            deleteHandler={deleteHandler}
            id={record._id}
            key={record._id}
          />
        ))}
      </section>
    </div>
  );
};

export default Home;

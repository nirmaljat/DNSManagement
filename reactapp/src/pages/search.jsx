import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Context, server } from "../main";
import { toast } from "react-hot-toast";
import DNSItem from "../components/DNSItem";
import { Navigate } from "react-router-dom";

const Search = () => {
  const [dnsRecords, setDNSRecords] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRecords, setFilteredRecords] = useState([]);
  const { isAuthenticated } = useContext(Context);

  useEffect(() => {
    axios
      .get(`${server}/DNS/my`, {
        withCredentials: true,
      })
      .then((res) => {
        setDNSRecords(res.data.dnss);
        setFilteredRecords(res.data.dnss); 
      })
      .catch((e) => {
        toast.error(e.response.data.message);
      });
  }, [refresh]);

  useEffect(() => {
   
    if (searchQuery.trim() === "") {
      setFilteredRecords(dnsRecords);
    } else {
      setFilteredRecords(
        dnsRecords.filter((record) =>
          record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.value.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, dnsRecords]);

 if (!isAuthenticated) return <Navigate to={"/login"} />;

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

  return (
    <div className="edit-mode">
      <div className="login">
        <section>
          <input
            type="text"
            placeholder="Search DNS records"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </section>
      </div>

      <section className="dnsContainer">
        {filteredRecords.length > 0 ? (
          filteredRecords.map((record) => (
            <DNSItem
            name={record.name}
            type={record.type}
            value={record.value}
            updateHandler={updateHandler}
            deleteHandler={deleteHandler}
            id={record._id}
            key={record._id}
            />
          ))
        ) : (
          <p>No results found</p>
        )}
      </section>
    </div>
    
  );
};

export default Search;

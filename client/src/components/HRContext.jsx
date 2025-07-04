import React, { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../api";

const HRContext = createContext();

export const HRProvider = ({ children }) => {
  const [hrName, setHrName] = useState("HR");

  useEffect(() => {
    const hrEmail = localStorage.getItem("userEmail");
    const token = localStorage.getItem("token");

    if (hrEmail && token) {
      axiosInstance
        .get(`/api/hr/email/${hrEmail}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setHrName(res.data.name || "HR");
        })
        .catch((err) => {
          console.error("❌ Failed to fetch HR name", err);
          setHrName("HR");
        });
    }
  }, []);

  return (
    <HRContext.Provider value={{ hrName }}>
      {children}
    </HRContext.Provider>
  );
};

export const useHR = () => useContext(HRContext);

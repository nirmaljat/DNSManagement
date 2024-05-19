import React, { useContext } from "react";
import { Context } from "../main";
import Loader from "../components/Loader";

const Profile = () => {
  const { isAuthenticated, loading, user } = useContext(Context);

  return loading ? (
    <Loader />
  ) : (
    <div className="info">
      <h2>{user?.name}</h2>
      <p>{user?.email}</p>
    </div>
  );
};

export default Profile;

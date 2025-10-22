"use client";

import { useSelector } from "react-redux";

const profile = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
      <p>Enjoy browsing your custom T-shirts!</p>
    </div>
  );
};

export default profile;

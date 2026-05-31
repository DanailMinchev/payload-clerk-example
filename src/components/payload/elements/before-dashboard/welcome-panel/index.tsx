import React from "react";
import SeedDatabaseButton from "./seed-database-button";

export const WelcomePanel: React.FC = () => {
  return (
    <>
      <h1>Welcome</h1>
      {process.env.NODE_ENV !== "production" && <SeedDatabaseButton />}
    </>
  );
};

export default WelcomePanel;

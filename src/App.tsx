// src/App.tsx
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AppRoutes from "./routes/approutes";

const App: React.FC = () => {
  return (
    <div>
      <main style={{ flex: 1 }}>
        <AppRoutes />
      </main>
    </div>
  );
};

export default App;

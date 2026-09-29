import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import FeedPage from "./pages/FeedPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (isLoggedIn) {
    return <FeedPage />;
  }

  return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
}

export default App;
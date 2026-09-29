import { useState } from "react";
function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  type LoginPageProps = {
    onLogin: () => void;
  };

  async function handleLogin() {
    const response = await fetch(
      "https://localhost:7134/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      }
    );

    console.log("Status:", response.status);

    if (!response.ok) {
      const error = await response.text();
      console.log("Error:", error);
      return;
    }

    const data = await response.json();
    localStorage.setItem("token", data.token);
    onLogin();
    console.log("Token:", data.token);
  }

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default LoginPage;
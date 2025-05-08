import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPaciente() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

  }


}

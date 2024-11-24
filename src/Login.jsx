import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

function Login() {
  const handleLoginSuccess = (credentialResponse) => {
    if (credentialResponse.credential) {
        console.log("Login successful")
      //console.log("Got response from oauth ",credentialResponse.credential)
      // Decode the JWT token
      const decodedToken = jwtDecode(credentialResponse.credential);

      // Log the entire decoded token to see its structure
      console.log("Decoded Token:", decodedToken);

      // Access the email and name
      const email = decodedToken.email || "Email not available";
      const name = decodedToken.name || "Name not available";

      console.log("Email:", email);
      console.log("Name:", name);

      // You can save the details in your state, localStorage, or send to the backend
    } else {
      console.error("Credential not found in the response");
    }
  };

  const handleLoginError = () => {
    console.error("Login Failed");
  };

  return (
    <div>
      <h1>Login Page</h1>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={handleLoginError}
      />
    </div>
  );
}

export default Login;

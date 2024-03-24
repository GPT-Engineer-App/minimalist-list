import React, { useState } from "react";
import { FormControl, FormLabel, Input, Button, useToast } from "@chakra-ui/react";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const toast = useToast();

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const API_URL = "https://backengine-tixq.fly.dev/signup";
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 204) {
        toast({
          title: "Success",
          description: "User registered successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <FormControl>
      <FormLabel htmlFor="email">Email</FormLabel>
      <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <FormLabel htmlFor="password">Password</FormLabel>
      <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <FormLabel htmlFor="confirm-password">Confirm Password</FormLabel>
      <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
      <Button mt={4} colorScheme="teal" onClick={handleSignUp}>
        Sign Up
      </Button>
    </FormControl>
  );
};

export default SignUp;

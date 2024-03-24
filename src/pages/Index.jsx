import React, { useState, useEffect } from "react";
import { Box, Heading, Input, Button, Text, VStack, HStack, useToast } from "@chakra-ui/react";
import { FaPlus, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";

const API_URL = "https://backengine-tixq.fly.dev";

const Index = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const toast = useToast();

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      setAccessToken(storedToken);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.accessToken);
        localStorage.setItem("accessToken", data.accessToken);
        setIsLoggedIn(true);
        toast({
          title: "Logged in",
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
      console.error("Error:", error);
    }
  };

  const handleLogout = () => {
    setAccessToken("");
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
  };

  const handleAddTask = async () => {
    if (newTask.trim() !== "") {
      try {
        const response = await fetch(`${API_URL}/tasks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ title: newTask }),
        });

        if (response.ok) {
          setTasks([...tasks, { title: newTask }]);
          setNewTask("");
        } else {
          console.error("Error adding task");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <Box maxWidth="400px" margin="auto" mt={8}>
      <Heading mb={8}>To-Do List</Heading>
      {isLoggedIn ? (
        <>
          <HStack mb={4}>
            <Input value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Enter a new task" />
            <Button onClick={handleAddTask} colorScheme="blue">
              <FaPlus />
            </Button>
          </HStack>
          <VStack align="stretch" spacing={2}>
            {tasks.map((task, index) => (
              <Box key={index} p={4} borderWidth={1} borderRadius="md" boxShadow="md">
                <Text>{task.title}</Text>
              </Box>
            ))}
          </VStack>
          <Button onClick={handleLogout} mt={8} colorScheme="red" leftIcon={<FaSignOutAlt />}>
            Logout
          </Button>
        </>
      ) : (
        <VStack spacing={4}>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
          <Button onClick={handleLogin} colorScheme="blue" leftIcon={<FaSignInAlt />}>
            Login
          </Button>
        </VStack>
      )}
    </Box>
  );
};

export default Index;

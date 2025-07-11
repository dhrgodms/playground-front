import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Flex,
  Box,
  Heading,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import serverUrl from "../Constants/Constants";
const LoginForm = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userEmail: "testEmail@gmail.com",
    userNickname: "testNickName",
  });

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      axios
        .post(`${serverUrl}:8080/login`, {
          userEmail: formData.userEmail,
        })
        .then((res) => {
          if (res?.data.message === "가입되지 않은 E-MAIL 입니다.") {
            toast({
              title: `회원정보가 존재하지 않습니다.`,
              status: "error",
              isClosable: true,
            });
          } else if (res.data) {
            if (res.data.userNickname === formData.userNickname) {
              toast({
                title: `'${formData?.userNickname}' 님 환영합니다.`,
                status: "success",
                isClosable: true,
              });
              navigate("/", { replace: true });
            } else {
              console.error("회원정보가 일치하지 않습니다.");
            }
          } else {
            console.error("로그인 실패");
          }
        });
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Flex align="center" justifyContent="center">
      <Box p={2}>
        <Box textAlign="center">
          <Heading style={{ marginBottom: "40px" }}>LOG IN</Heading>
        </Box>
        <Box my={4} textAlign="left">
          <form
            onSubmit={handleSubmit}
            style={{ flexDirection: "column", gap: "10px" }}
          >
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="text"
                onChange={handleInputChange}
                name="userEmail"
                value={formData && formData.userEmail}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Nickname</FormLabel>
              <Input
                type="text"
                onChange={handleInputChange}
                name="userNickname"
                value={formData && formData.userNickname}
              />
            </FormControl>
            <Flex
              style={{
                flexDirection: "column",
                marginTop: "20px",
                gap: "10px",
              }}
            >
              <Button type="sumbit" colorScheme="pink">
                Login
              </Button>
              <Button type="button" onClick={() => navigate("/signup")}>
                Sign Up
              </Button>
            </Flex>
          </form>
        </Box>
      </Box>
    </Flex>
  );
};

export default LoginForm;

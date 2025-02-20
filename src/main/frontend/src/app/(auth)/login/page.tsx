"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import {App, Button, Checkbox, Form, Input, Flex, message } from "antd";
import { login } from "@/utils/auth";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: { email: string; password: string; remember?: boolean }) => {
    setLoading(true);
    console.log(values);
    try {
      await login(values.email, values.password);
      messageApi.success("Login effettuato con successo!");
      router.push("/dashboard");
    } catch {
      messageApi.error("Credenziali non valide. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <App>
        {contextHolder}
    <div className="flex min-h-screen">
      <div
        aria-hidden="true"
        className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20"
      >
        <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-400 dark:from-blue-700"></div>
        <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300 dark:to-indigo-600"></div>
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <Form name="login" initialValues={{ remember: true }} onFinish={onFinish}>
          <div className="flex items-center space-x-2 no-underline">
            <div aria-hidden="true" className="flex space-x-1">
              <div className="h-10 w-2 bg-primary"></div>
            </div>
            <span className="text-5xl font-bold text-body dark:text-white">MedExpress</span>
          </div>
          <div className="sm:mx-auto sm:w-full sm:max-w-sm my-16">
            <h2 className="text-center text-xl font-bold tracking-tight dark:text-white">
              Accedi al tuo account
            </h2>
          </div>
          <Form.Item
            name="email"
            rules={[{ type: "email", required: true, message: "Inserisci una Email valida!" }]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Inserisci la Password!" }]}
          >
            <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Flex justify="space-between" align="center">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox className="dark:text-white">Ricordami</Checkbox>
              </Form.Item>
              <a className="dark:text-white" href="/forgot-password">
                Password dimenticata?
              </a>
            </Flex>
          </Form.Item>
          <Form.Item className="dark:text-white">
            <Button block type="primary" htmlType="submit" loading={loading}>
              Accedi
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="hidden md:block md:w-1/2 bg-pattern"></div>
    </div>
    </App>
  );
}

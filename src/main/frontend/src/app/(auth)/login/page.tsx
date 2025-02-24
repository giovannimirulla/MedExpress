"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { App, Button, Checkbox, Form, Input, Flex, message, Segmented } from "antd";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faStaffSnake } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/context/authContext';

import { AuthEntityType, AuthEntityTypeIcon } from '@/enums/AuthEntityType';

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [entity, setEntity] = useState(AuthEntityType.User);
  const [messageApi, contextHolder] = message.useMessage();
  const { login } = useAuth();

  const authEntityOptions = Object.values(AuthEntityType).map((type) => ({
    label: AuthEntityTypeIcon[type as AuthEntityType],
    value: type,
  }));

  const onFinish = async (values: { email: string; password: string; remember?: boolean }) => {
    setLoading(true);
    const success = await login(entity, values.email, values.password);
    console.log(success);
    if (success) {
      messageApi.success("Login effettuato con successo!");
      router.push('/dashboard');
    } else {
      messageApi.error("Credenziali non valide. Riprova.");
    }
    setLoading(false);
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
            <div className="sm:mx-auto sm:w-full sm:max-w-sm mt-16 mb-8">
              <h2 className="text-center text-xl font-bold tracking-tight dark:text-white">
                Accedi al tuo account
              </h2>
            </div>
            <Segmented
           size="large"
          className="mb-16 w-full"
          defaultValue={AuthEntityType.User}
          shape="round"
          block
          options={authEntityOptions}
          onChange={(val:AuthEntityType) => setEntity(val)}
    />
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

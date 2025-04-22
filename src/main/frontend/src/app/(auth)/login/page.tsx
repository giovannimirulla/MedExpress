"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { App, Button, Form, Input, Flex, message, Segmented } from "antd";
import { useAuth } from '@/context/authContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCapsules } from "@fortawesome/free-solid-svg-icons";
import type { FormProps } from 'antd';
import { AuthEntityType, AuthEntityTypeIcon } from '@/enums/AuthEntityType';

type FieldType = {  
  email: string;
  password: string;
  remember?: boolean;
};

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [entity, setEntity] = useState(AuthEntityType.User);
  const [messageApi, contextHolder] = message.useMessage();
  const { login } = useAuth();

  const authEntityOptions = Object.values(AuthEntityType).map((type) => ({
    label: (
      <span>
        {AuthEntityTypeIcon[type as AuthEntityType]} {type}
      </span>
    ),
    value: type,
  }));

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    setLoading(true);
    try {
      const success = await login(entity, values.email, values.password);
      if (success) {
        messageApi.success("Login effettuato con successo!");
        router.push('/dashboard'); // Navigazione senza refresh
      } else {
        messageApi.error("Credenziali non valide. Riprova.");
      }
    } catch  {
      messageApi.error("Si è verificato un errore. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
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
          <Form name="login" initialValues={{ remember: true }} onFinish={onFinish} onFinishFailed={onFinishFailed}>
            <div className="flex items-center space-x-2 no-underline">
               <FontAwesomeIcon icon={faCapsules} className="text-primary h-12" />
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
                {/* <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox className="dark:text-white">Ricordami</Checkbox>
                </Form.Item> */}
                {/* <a className="dark:text-white" href="/forgot-password">
                  Password dimenticata?
                </a> */}
                <a className="dark:text-white group" href="/signup">
                    <span className="transition-colors duration-300 group-hover:text-black mr-2">
                    Non hai un account?
                    </span>
                    <span className="transition-colors duration-300 group-hover:text-primary">
                    Registrati qui!
                    </span>
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

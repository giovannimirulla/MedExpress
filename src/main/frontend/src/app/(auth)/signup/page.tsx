"use client";

import { useState, } from "react";
import { Button, Form, Input, Segmented, Flex, Select } from "antd";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faIdCard, faEnvelope, faLocationDot, faLock, faUserDoctor } from '@fortawesome/free-solid-svg-icons';
import {DebounceSelect} from '@/components/DebounceSelect';
import api from '@/utils/api';

import { AuthEntityType, AuthEntityTypeIcon } from '@/enums/AuthEntityType';
import { Role } from "@/enums/Role";

  // Usage of DebounceSelect
  interface UserValue {
    label: string;
    value: string;
  }
  

export default function Signup() {
  const [loading, setLoading] = useState(false);
  const [entity, setEntity] = useState(AuthEntityType.User);
  const [value, setValue] = useState<UserValue[]>([]);

  const authEntityOptions = Object.values(AuthEntityType).map((type) => ({
    label: (
      <span>
        {AuthEntityTypeIcon[type as AuthEntityType]} {type}
      </span>
    ),
    value: type,
  }));


// async function fetchUserList(username: string): Promise<UserValue[]> {
//   console.log('fetching user', username);
  

//   return fetch('https://randomuser.me/api/?results=5')
//     .then((response) => response.json())
//     .then((body) =>
//       body.results.map(
//         (user: { name: { first: string; last: string }; login: { username: string } }) => ({
//           label: `${user.name.first} ${user.name.last}`,
//           value: user.login.username,
//         }),
//       ),
//     );
// }


//http://localhost:8080/api/v1/doctor/search?query=John
//fetch doctor 

async function fetchDoctorList(query: string): Promise<UserValue[]> {
  console.log('fetching doctor', query);

  return api.get(`/doctor/search?query=${query}`)
    .then((response) => response.data)
    .then((body) =>
      body.map(
        (doctor: { name: string; surname: string; id: string }) => ({
          label: `${doctor.name} ${doctor.surname}`,
          value: doctor.id,
        }),
      ),
    );
}






  const onFinish = async (values: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    remember?: boolean;
  }) => {
    setLoading(true);
    console.log(values);
  };

  const validatePassword = ({ getFieldValue }: { getFieldValue: (name: string) => string }) => ({
    validator(_: unknown, value: string) {
      if (!value || getFieldValue("password") === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("Le password non coincidono!"));
    },
  });

  return (
    <div className="flex min-h-screen">
      <div
        aria-hidden="true"
        className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20"
      >
        <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-400 dark:from-blue-700"></div>
        <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300 dark:to-indigo-600"></div>
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <Form name="signup" initialValues={{ remember: true }} onFinish={onFinish} className="w-1/2">
          <div className="flex items-center space-x-2 no-underline">
            <div aria-hidden="true" className="flex space-x-1">
              <div className="h-10 w-2 bg-primary"></div>
            </div>
            <span className="text-5xl font-bold text-body dark:text-white">MedExpress</span>
          </div>
          <div className="sm:mx-auto sm:w-full sm:max-w-sm mt-16 mb-8">
            <h2 className="text-center text-xl font-bold tracking-tight dark:text-white">
              Crea il tuo account
            </h2>
          </div>
          <Form.Item name="role" rules={[{ required: true, message: "Seleziona il tuo ruolo!" }]}>
          <Segmented
           size="large"
          className="mb-16 w-full"
          shape="round"
          block
          options={authEntityOptions}
              onChange={(val:AuthEntityType) => setEntity(val)}
            />
          </Form.Item>
          {entity === AuthEntityType.Pharmacy ? (
            <Form.Item name="companyName" rules={[{ required: true, message: "Inserisci il nome della tua azienda!" }]}>
              <Input prefix={<FontAwesomeIcon icon={faUser} className="text-gray-200 mr-2" />} placeholder="Nome Azienda" />
            </Form.Item>
          ) : (
            <div className="flex flex-row gap-4 w-full">
              <Form.Item name="name" className="w-full" rules={[{ required: true, message: "Inserisci il tuo Nome!" }]}>
                <Input prefix={<FontAwesomeIcon icon={faUser} className="text-gray-200 mr-2" />} placeholder="Nome" />
              </Form.Item>
              <Form.Item name="surname" className="w-full" rules={[{ required: true, message: "Inserisci il tuo Cognome!" }]}>
                <Input prefix={<FontAwesomeIcon icon={faUser} className="text-gray-200 mr-2"/>} placeholder="Cognome" />
              </Form.Item>
            </div>
          )}
          {entity === AuthEntityType.User && (
            <Form.Item  className="dark:text-white">
                 <Select
                 placeholder="Seleziona il tuo ruolo"
                 prefix={<FontAwesomeIcon icon={faIdCard} className="text-gray-200 mr-2"/>}
                 defaultValue={Object.keys(Role).length > 0 ? Object.values(Role)[0] : undefined}
                 options={Object.values(Role).map(role => ({ label: role, value: role }))}
              />
            </Form.Item>
          )}

          {entity === AuthEntityType.User && (
                           <Form.Item  className="dark:text-white">
                           <DebounceSelect
                           prefix={<FontAwesomeIcon icon={faUserDoctor}  className="text-gray-200 mr-2"/>}
                      mode="multiple"
                      value={value}
                      placeholder="Seleziona un dottore"
                      fetchOptions={fetchDoctorList}
                      onChange={(newValue) => {
                        setValue(newValue as UserValue[]);
                      }}
                      style={{ width: '100%' }}
                    />
                          </Form.Item>
          )}


        {entity === AuthEntityType.Pharmacy ? (
            <Form.Item name="vatNumber" rules={[{ required: true, message: "Inserisci la Partita IVA!" }]}>
              <Input prefix={<FontAwesomeIcon icon={faIdCard} className="text-gray-200 mr-2"/>} placeholder="Partita IVA" />
            </Form.Item>
          ) : (
            <Form.Item name="fiscalCode" rules={[{ required: true, message: "Inserisci il Codice Fiscale!" }]}>
              <Input prefix={<FontAwesomeIcon icon={faIdCard} className="text-gray-200 mr-2"/>} placeholder="Codice Fiscale" />
            </Form.Item>
          )}
          <Form.Item name="address" rules={[{ required: true, message: "Inserisci il tuo Indirizzo!" }]}>
            <Input prefix={<FontAwesomeIcon icon={faLocationDot} className="text-gray-200 mr-2"/>} placeholder="Indirizzo" />
          </Form.Item>
          <Form.Item name="email" rules={[{ type: "email", required: true, message: "Inserisci una Email valida!" }]}>
            <Input prefix={<FontAwesomeIcon icon={faEnvelope} className="text-gray-200 mr-2"/>} placeholder="Email" />
          </Form.Item>
          <div className="flex flex-row gap-4">
          <Form.Item name="password" className="w-full" rules={[{ required: true, message: "Inserisci la Password!" }]}>
            <Input prefix={<FontAwesomeIcon icon={faLock} className="text-gray-200 mr-2"/>} type="password" placeholder="Password" />
          </Form.Item>
          <Form.Item name="confirmPassword" className="w-full" dependencies={["password"]} rules={[{ required: true, message: "Conferma la Password!" }, validatePassword]}>
            <Input prefix={<FontAwesomeIcon icon={faLock} className="text-gray-200 mr-2"/>} type="password" placeholder="Conferma Password" />
          </Form.Item>
          </div>
          <Form.Item>
            <Flex justify="space-between" align="center">
              {/* <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox className="dark:text-white">Ricordami</Checkbox>
              </Form.Item> */}
              <a className="dark:text-white" href="/login">
                Hai già un account?
              </a>
            </Flex>
          </Form.Item>
          <Form.Item className="dark:text-white">
            <Button block type="primary" htmlType="submit" loading={loading}>
              Registrati
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="hidden md:block md:w-1/2 bg-pattern"></div>
    </div>
  );
}

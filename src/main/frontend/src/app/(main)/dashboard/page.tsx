"use client";
import { DashboardOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons';
import { Layout, Menu, Card } from 'antd';

const { Sider, Header, Content } = Layout;

export default function Dashboard() {
    return (
        <Layout className="min-h-screen">
            <Sider breakpoint="lg" collapsedWidth="0" className="bg-gray-800">
                <div className="p-4 text-white text-2xl font-bold">
                    MedExpress
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={[
                        { key: '1', icon: <DashboardOutlined />, label: 'Dashboard' },
                        { key: '2', icon: <UserOutlined />, label: 'Profilo' },
                        { key: '3', icon: <SettingOutlined />, label: 'Impostazioni' },
                    ]}
                />
            </Sider>
            <Layout>
                <Header className="bg-white shadow p-4">
                    <h1 className="text-xl font-bold">Dashboard</h1>
                </Header>
                <Content className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Card title="Statistiche" bordered={false}>
                            Contenuti delle statistiche.
                        </Card>
                        <Card title="Attività Recenti" bordered={false}>
                            Contenuti delle attività.
                        </Card>
                        <Card title="Messaggi" bordered={false}>
                            Contenuti dei messaggi.
                        </Card>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
}
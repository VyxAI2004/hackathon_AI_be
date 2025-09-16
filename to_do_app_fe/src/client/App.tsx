import { Outlet, Route, Routes } from "react-router-dom";

import { RefineThemes, useNotificationProvider } from "@refinedev/antd";
import { Authenticated, ErrorComponent, Refine } from "@refinedev/core";

import routerProvider, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";

import { App as AntdApp, ConfigProvider } from "antd";

import { Layout } from "../client/components/layout"
import { resources } from "../client/config/resources"
import { authProvider } from "../client/providers"
import {DashboardPage} from "../client/pages/dashboard";
import {LoginPage} from "../client/pages/login";
import {TasksCreatePage, TasksEditPage, TasksListPage} from "../client/pages/tasks";

import "@refinedev/antd/dist/reset.css";

const App = () => {
  return (
    <ConfigProvider theme={RefineThemes.Blue}>
      <AntdApp>
          <Refine
            routerProvider={routerProvider}
            notificationProvider={useNotificationProvider}
            authProvider={authProvider}
            resources={resources}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              liveMode: "auto",
              useNewQueryKeys: true,
            }}
          >
            <Routes>
              <Route
                element={
                  <Authenticated
                    key="authenticated-layout"
                    fallback={<CatchAllNavigate to="/login" />}
                  >
                    <Layout>
                      <Outlet />
                    </Layout>
                  </Authenticated>
                }
              >
                <Route index element={<DashboardPage />} />

                <Route
                  path="/tasks"
                  element={
                    <TasksListPage>
                      <Outlet />
                    </TasksListPage>
                  }
                >
                  <Route path="new" element={<TasksCreatePage />} />
                  <Route path="edit/:id" element={<TasksEditPage />} />
                </Route>

                <Route path="*" element={<ErrorComponent />} />
              </Route>

              <Route
                element={
                  <Authenticated
                    key="authenticated-auth"
                    fallback={<Outlet />}
                  >
                    <NavigateToResource resource="dashboard" />
                  </Authenticated>
                }
              >
                <Route path="/login" element={<LoginPage />} />
              </Route>
            </Routes>
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>
      </AntdApp>
    </ConfigProvider>
  );
};

export default App;



// import './App.css'
// import hackathonGraphic from '../assets/hackathon-graphic.svg'
// import naverLogo from '../assets/naver-logo.svg'

// function App() {
// 	return (
// 		<div className="container">
// 			<div className="content">
// 				<img src={naverLogo} alt="NAVER Vietnam AI Hackathon" className="logo" />
        
// 				<div className="greeting">
// 					<p className="hello">Xin chào! 안녕하세요!</p>
// 					<p className="subtitle">HACKATHON TO DO APP</p>
// 				</div>
// 			</div>
      
// 			<img className="graphic" src={hackathonGraphic} alt="" />
// 		</div>
// 	)
// }

// export default App


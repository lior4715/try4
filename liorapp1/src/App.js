import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./components/Layouts/RootLayout";
import HomePage from "./pages/HomePage.js";
import { loader as taskLoader } from "./components/tasks/TaskList";
import { AuthProvider } from "./context/AuthContext";
import { TaskProvider } from "./context/TaskContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage />, id: "home", loader: taskLoader },
    ],
  },
]);

function App() {
  return (
    <TaskProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </TaskProvider>
  );
}

export default App;

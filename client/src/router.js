import { Route, Routes } from "react-router-dom";

import CreateList from "./pages/CreateList";
import Error from "./pages/Error";
import AuthForm from "./pages/AuthForm";
import MainPage from "./pages/MainPage";
import CardItem from "./components/CardItem";

export const router = (isAuthorized) => {
  if (isAuthorized) {
    return (
      <Routes>
        <Route path="/create" element={<CreateList />} />
        <Route path="/" element={<MainPage />} />
        <Route path="*" element={<Error />} />
        <Route path="/:id" element={<CardItem>Обновить</CardItem>} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<AuthForm />} />
      <Route path="*" element={<Error />} />
    </Routes>
  );
};

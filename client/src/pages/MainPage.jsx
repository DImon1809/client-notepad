import { useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import Loading from "../components/Loading.jsx";

import "./MainPage.scss";

import { Context } from "../Contex";

const MainPage = () => {
  const { request, token, error, clearErrors, ready } = useContext(Context);
  const [lists, setLists] = useState([]);
  const navigate = useNavigate();

  const deletePointHandler = async (event, id, title) => {
    try {
      event.preventDefault();

      const response = await request(
        "delete",
        `/list/delete/${id}`,
        {},
        {
          "Content-Type": "application/json",
          authorization: token,
        }
      );

      setLists(lists.filter((elem) => elem.title !== title));

      return response && alert(response?.data?.message || "Воу!");
    } catch (err) {
      console.error(err);
    }
  };

  const getDataHandler = useCallback(async () => {
    try {
      const response = await request(
        "get",
        "/list/all",
        {},
        {
          "Content-Type": "application/json",
          authorization: token,
        }
      );

      if (!response?.data) return setLists([]);

      setLists(response.data);
    } catch (err) {
      console.error(err);
    }
  }, [request, token]);

  const onOpenHandler = (event, id) => {
    event.preventDefault();

    navigate(`/${id}`);
  };

  useEffect(() => {
    if (error) {
      error?.response?.data?.message
        ? alert(error?.response?.data?.message)
        : alert("Что-то пошло не так!");
    }

    clearErrors();
  }, [clearErrors, error]);

  useEffect(() => {
    getDataHandler();
  }, [getDataHandler]);

  return ready ? (
    <section className="main-page">
      <div className="container-table">
        <table>
          <thead>
            <tr>
              <td>Наименование статьи</td>
              <td colSpan="2" style={{ textAlign: "center" }}>
                Действия
              </td>
            </tr>
          </thead>
          {lists.length ? (
            <tbody>
              {lists.map((elem, key) => {
                return (
                  <tr key={key}>
                    <td>{elem.title}</td>
                    <td onClick={(event) => onOpenHandler(event, elem._id)}>
                      Открыть
                    </td>
                    <td
                      onClick={(event) =>
                        deletePointHandler(event, elem._id, elem.title)
                      }
                    >
                      Удалить
                    </td>
                  </tr>
                );
              })}
            </tbody>
          ) : (
            <></>
          )}
        </table>
      </div>
    </section>
  ) : (
    <>
      <Loading />
    </>
  );
};

export default MainPage;

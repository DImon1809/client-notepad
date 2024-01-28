import { useContext, useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";

import Loading from "./Loading";

import "./CardItem.scss";

import { Context } from "../Contex";

const CardItem = (props) => {
  const { request, token, error, clearErrors, ready } = useContext(Context);
  const [title, setTitle] = useState("");
  const [paragraph, setParagraph] = useState("");
  const { id } = useParams();

  const requireData = useCallback(async () => {
    try {
      const response = await request(
        "get",
        `/list/${id}`,
        {},
        {
          "Content-Type": "application/json",
          authorization: token,
        }
      );

      setTitle(response.data.title);
      setParagraph(response.data.paragraph);
    } catch (err) {
      console.error(err);
    }
  }, [request, id, token]);

  const sendAndUpdateDataHandler = async (event) => {
    try {
      event.preventDefault();

      let response = null;

      if (!id) {
        response = await request(
          "post",
          "/list/create",
          { title: title.trim(), paragraph: paragraph.trim() },
          {
            "Content-Type": "application/json",
            authorization: token,
          }
        );

        return response && alert(response?.data?.message || "Воу!");
      }

      response = await request(
        "patch",
        `/list/${id}`,
        { title: title.trim(), paragraph: paragraph.trim() },
        {
          "Content-Type": "application/json",
          authorization: token,
        }
      );

      return response && alert(response?.data?.message || "Воу!");
    } catch (err) {
      console.error(err);
    }
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
    if (id) requireData();
  }, [id, requireData]);

  return ready ? (
    <section className="create-list">
      <h1>Заполните форму записи</h1>
      <form className="form-list">
        <div className="form-list-content">
          <input
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <label htmlFor="title">Заголовок</label>
        </div>

        <div className="form-list-content">
          <textarea
            name="paragraph"
            id="paragraph"
            value={paragraph}
            onChange={(event) => setParagraph(event.target.value)}
          ></textarea>
          <label htmlFor="paragraph">Введите текст</label>
        </div>

        <div className="red-button" onClick={sendAndUpdateDataHandler}>
          <div className="red-button-left"></div>
          <div className="red-button-right"></div>
          <button>{props.children}</button>
        </div>
      </form>
    </section>
  ) : (
    <Loading />
  );
};

export default CardItem;

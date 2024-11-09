import React, { useEffect, useState } from "react";
import axios from "axios";

interface UserData {
  id_user: Number;
  nombre: String;
  players: Array<Number>;
}

export default function InGameList() {
  const [userData, setUserData] = useState<Array<UserData>>([]);
  useEffect(() => {
    axios
      .get("/user")
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching the game list:", error);
      });
  }, []);

  console.log(
    userData.find(
      (usr) => usr.id_user == Number(localStorage.getItem("userId"))
    )
  );

  return <div></div>;
}

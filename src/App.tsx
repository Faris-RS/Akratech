import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Typography,
} from "@material-ui/core";
import getRandomUsers from "./api";
import { db } from "./db";

interface User {
  login: {
    uuid: string;
  };
  name: {
    first: string;
    last: string;
  };
  picture: {
    thumbnail: string;
  };
}

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<User[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [refreshClicked, setRefreshClicked] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const count = await db.users.count();
        if (refreshClicked || count === 0) {
          const randomUsers = await getRandomUsers(50);
          await db.users.clear();
          await db.users.bulkAdd(randomUsers);
          setTotalItems(await db.users.count());
          setUsers(randomUsers);
          setRefreshClicked(false);
        } else {
          const usersFromDB = await db.users.toArray();
          setTotalItems(count);
          setUsers(usersFromDB);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [refreshClicked]);

  const handleRefresh = async () => {
    setRefreshClicked(true);
  };

  const handleDelete = async (userId: string) => {
    await db.users.where("login.uuid").equals(userId).delete();
    const newTotalCount = await db.users.count();
    setTotalItems(newTotalCount);
    setUsers((prevUsers) =>
      prevUsers.filter((user) => user.login.uuid !== userId)
    );
  };

  return (
    <div>
      <div
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          background: "#ffffff",
          padding: "10px 20px",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#c51162",
          marginLeft: "-10px",
        }}
      >
        <Typography
          variant="h6"
          style={{ marginBottom: "10px", marginTop: "10px" }}
        >
          Total Number of items Displayed: {totalItems}
        </Typography>
        <Button variant="contained" color="primary" onClick={handleRefresh}>
          Refresh
        </Button>
      </div>
      <div style={{ marginTop: "100px", padding: "20px" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {loading ? (
            <div style={{ textAlign: "center", marginTop: "40%" }}>
              <CircularProgress />
            </div>
          ) : (
            <>
              {users.map((user) => (
                <Card
                  key={user.login.uuid}
                  style={{ width: "250px", margin: "10px" }}
                >
                  <CardMedia
                    component="img"
                    alt="Profile"
                    height="150"
                    image={user.picture.thumbnail}
                  />
                  <CardContent style={{ textAlign: "center" }}>
                    <Typography variant="h6">
                      {user.name.first} {user.name.last}
                    </Typography>
                  </CardContent>
                  <CardActions style={{ justifyContent: "center" }}>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDelete(user.login.uuid)}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;

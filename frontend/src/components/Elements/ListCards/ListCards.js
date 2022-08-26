import React from "react";
import { useSelector } from "react-redux";
import classes from "./ListCards.module.css";

function ListCards({ list, setFilled, setDisplay }) {
  console.log(list);
  let spots = useSelector((state) => state.spots);

  const handleClick = () => {
    setFilled(true);
    setDisplay(false);
  };
  return (
    <>
      {list.wishspots && Object.values(list.wishspots).length ? (
        <div className={classes.newList} onClick={handleClick}>
          <div className={classes.addButton}>
            <img
              className={classes.img}
              src={`${
                spots[Object.values(list.wishspots)[0].spotId].spot.img1
              }`}
            />
          </div>
          <strong className={classes.create}>{list.name}</strong>
        </div>
      ) : (
        <>
          <div className={classes.newList} onClick={handleClick}>
            <div className={classes.fakeImg}></div>
            <strong className={classes.create}>{list.name}</strong>
          </div>
        </>
      )}
    </>
  );
}

export default ListCards;

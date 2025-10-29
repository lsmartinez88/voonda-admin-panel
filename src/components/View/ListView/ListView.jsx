import React from "react";

function ListView({ dataSource, renderItem }) {
  let Component = renderItem;
  return (
    <div>
      {dataSource.map((item, index) => (
        <Component item={item} key={index} />
      ))}
    </div>
  );
}

export { ListView };

import React from "react";

interface NoDataProps {
  message: string;
}

const NoData = (props: NoDataProps) => {
  return (
    <div className="no_data w-full">
      <div className="text-center my-10">
        <p className="text-gray-500">{props.message}</p>
      </div>
    </div>
  );
};

export default NoData;

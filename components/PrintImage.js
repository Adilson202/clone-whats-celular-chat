import React from "react";
import Image from "next/image";
import styled from "styled-components";

const PrintImage = ({ url }) => {
  return (
    <>
      {url ? (
        <UrlPrint>
          <Image src={url} alt={url} layout="fill" />
        </UrlPrint>
      ) : null}
    </>
  );
};

const UrlPrint = styled.div`
  position: fixed;
  bottom: 70px;
  width: 16rem;
  height: 10rem;
  background-color: #ffffff;
  border-radius: 10px;
  border: 3px solid #98fb98;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
`;

export default PrintImage;

import React from "react";
import Image from "next/image";
import styled from "styled-components";

const PrintImage = ({url}) => {
  
  return (
    <>
    { url ? (<UrlPrint>      
        <Image src={url} alt={url} layout="fill" /> 
        </UrlPrint>)
    : null }   
    </>    
  );
};

const UrlPrint = styled.div`
position: fixed;
bottom: 60px;
width: 15rem;
height: 10rem;
background-color: white;
border-radius: 10px;
box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.4);

`

export default PrintImage;

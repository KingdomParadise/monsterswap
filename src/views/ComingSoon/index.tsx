import React from 'react'
import styled from 'styled-components'
import {Image} from 'uikit'

const Container = styled.div`
  max-width: 1200px;
  margin: 49px auto;

  @media (max-width: 767.98px) {
    padding-left: 10px;
    padding-right: 10px;
  }
`

const ComingSoonContent = styled.div`
  padding: 60px 90px;
  border-radius: 10px;
  background: #eaf2f7;
  text-align: center;
  display: flex;
  justify-content: space-between;

  @media (max-width: 767.98px) {
    padding: 20px;
    flex-direction: column-reverse;
  }
`

const ComingSoonContentLeft = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  & h1 {
    font-size: 48px;
    line-height: 55px;
    color: #524f9e;
    margin-bottom: 12px;
  }
  & p {
    color: #524f9e;
    font-family: 'Red Hat Text', sans-serif;
    font-size: 18px;
    line-height: 24px;
  }

  @media (max-width: 767.98px) {
    width: 100%;
    margin-bottom: 20px;
  }
`

const ComingSoonContentRight = styled.div`
  width: 50%;  
  display: flex;
  justify-content: flex-end;
  align-items: center;

  @media (max-width: 767.98px) {
    width: 100%;
    margin-bottom: 30px;

    & > div {
      transform: scale(.8);
    }
  }
`

interface ComingSoonProps {
  feature: string
}

const ComingSoon: React.FC<ComingSoonProps> = ({ feature }) => {
  return (
    <Container>
      <ComingSoonContent>
        <ComingSoonContentLeft>
          <h1>Coming Soon</h1>
          <p>{feature} features will be available soon</p>
        </ComingSoonContentLeft>
        <ComingSoonContentRight>
          <Image src="/images/ic-coming-soon.svg" alt="Coming Soon" width={318} height={200} />
        </ComingSoonContentRight>
      </ComingSoonContent>
    </Container>
  )
}

export default ComingSoon

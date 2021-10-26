import React from 'react'
import styled from 'styled-components'
import { Flex, Card, Button, Image } from 'uikit'
import { ReactComponent as NoAvatar } from 'assets/images/NoAvatar.svg'
import { useWeb3React } from '@web3-react/core'
// import useTheme from 'hooks/useTheme'

const Container = styled.div`
  max-width: 1200px;
  margin: 47px auto;

  @media (max-width: 767.98px) {
    padding-left: 10px;
    padding-right: 10px;
    margin: 30px auto;
  }
`

const ReferralBanner = styled.div`
  text-align: center;
  display: flex;
  justify-content: center;
`

const UnlockWrapper = styled.div`
  max-width: 1200px;
  margin: 105px auto 0;
  padding: 32px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #eaf2f7;
  border-radius: 10px;
  width: 100%;
  & button {
    background: #49468a;
  }
  & p {
    font-size: 14px;
    line-height: 25.2px;
    font-weight: 500;
    font-family: 'Red Hat Text', sans-serif;
    color: #4e4e9d;
    margin-top: 32px;
  }

  @media (max-width: 767.98px) {
    margin: 30px auto;
  }
`
const ReferralContent = styled.div`
  max-width: 768px;
  margin: 105px auto 32px;
  width: 100%;
  & > div > div {
    width: 100%;

    ${({ theme }) => theme.mediaQueries.md} {
      width: 49%;
    }
  }

  @media (max-width: 767.98px) {
    margin: 30px auto;

    & > div:nth-child(2) {
      flex-direction: column;

      & > div:nth-child(1) {
        margin-bottom: 20px;
      }
    }
  }
`

const StyledCard = styled(Card)`
  padding: 24px 32px;
  border-radius: 8px;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.04);
  & h1 {
    font-size: 18px;
    line-height: 21px;
    color: #49468a;
    margin-bottom: 20px;
  }
  & p {
    font-family: 'Red Hat Text', sans-serif;
    font-size: 18px;
    line-height: 24px;
    font-weight: 700;
    color: #49468a;
  }
`

const ReferralCount = styled.div`
  display: flex;
  align-items: center;
  & svg {
    width: 32px;
    height: 32px;
    margin-right: 12px;
  }
`



const CommissionEarned = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  & button {
    background: #49468a;
  }
`

const Referrals: React.FC = () => {
  // const { theme } = useTheme()
  const { account } = useWeb3React()

  return (
    <Container>
      <ReferralBanner>
        <Image src="/images/referral/ic-referral.svg" alt="Referral" width={557} height={140} />
      </ReferralBanner>
      {account ? (
        <ReferralContent>
          <StyledCard style={{ marginBottom: 24 }}>
            <h1>Referral Link</h1>
          </StyledCard>
          <Flex justifyContent="space-between">
            <StyledCard>
              <h1>Total Referral</h1>
              <ReferralCount>
                <NoAvatar />
                <p>20</p>
              </ReferralCount>
            </StyledCard>
            <StyledCard>
              <h1>Commission Earned</h1>
              <CommissionEarned>
                <p>500 Monster</p>
                <Button>Claim</Button>
              </CommissionEarned>
            </StyledCard>
          </Flex>
        </ReferralContent>
      ) : (
        <UnlockWrapper>
          <Button>Unlock Wallet</Button>
          <p>Unlock wallet to get your unique referral link</p>
        </UnlockWrapper>
      )}
    </Container>
  )
}

export default Referrals

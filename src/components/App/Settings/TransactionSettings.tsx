import React, { useState } from 'react'
import { Text, Button, Input, Flex, Grid } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import QuestionHelper from '../../QuestionHelper'
import { AutoColumn } from '../../Layout/Column'
import { RowBetween, RowFixed } from '../../Layout/Row'

enum SlippageError {
  InvalidInput = 'InvalidInput',
  RiskyLow = 'RiskyLow',
  RiskyHigh = 'RiskyHigh',
}

enum DeadlineError {
  InvalidInput = 'InvalidInput',
}

export interface SlippageTabsProps {
  rawSlippage: number
  setRawSlippage: (rawSlippage: number) => void
  deadline: number
  setDeadline: (deadline: number) => void
}

export default function SlippageTabs({ rawSlippage, setRawSlippage, deadline, setDeadline }: SlippageTabsProps) {
  const [slippageInput, setSlippageInput] = useState('')
  const [deadlineInput, setDeadlineInput] = useState('')

  const { t } = useTranslation()

  const slippageInputIsValid =
    slippageInput === '' || (rawSlippage / 100).toFixed(2) === Number.parseFloat(slippageInput).toFixed(2)
  const deadlineInputIsValid = deadlineInput === '' || (deadline / 60).toString() === deadlineInput

  let slippageError: SlippageError | undefined
  if (slippageInput !== '' && !slippageInputIsValid) {
    slippageError = SlippageError.InvalidInput
  } else if (slippageInputIsValid && rawSlippage < 50) {
    slippageError = SlippageError.RiskyLow
  } else if (slippageInputIsValid && rawSlippage > 500) {
    slippageError = SlippageError.RiskyHigh
  } else {
    slippageError = undefined
  }

  let deadlineError: DeadlineError | undefined
  if (deadlineInput !== '' && !deadlineInputIsValid) {
    deadlineError = DeadlineError.InvalidInput
  } else {
    deadlineError = undefined
  }

  function parseCustomSlippage(value: string) {
    setSlippageInput(value)

    try {
      const valueAsIntFromRoundedFloat = Number.parseInt((Number.parseFloat(value) * 100).toString())
      if (!Number.isNaN(valueAsIntFromRoundedFloat) && valueAsIntFromRoundedFloat < 5000) {
        setRawSlippage(valueAsIntFromRoundedFloat)
      }
    } catch (error) {
      console.error(error)
    }
  }

  function parseCustomDeadline(value: string) {
    setDeadlineInput(value)

    try {
      const valueAsInt: number = Number.parseInt(value) * 60
      if (!Number.isNaN(valueAsInt) && valueAsInt > 0) {
        setDeadline(valueAsInt)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <AutoColumn gap="md">
      <AutoColumn gap="sm">
        <RowFixed>
          <Text color="#110518" fontSize="20px" fontFamily="UbuntuBold">{t('Slippage Tolerance')}</Text>
        </RowFixed>
        <Flex flexWrap={['wrap', 'wrap', 'nowrap']}>
          <Grid gridTemplateColumns="1fr 1fr 1fr" gridGap="8px" mb={['8px', '8px', 0]} mr={[0, 0, '8px']}>
            <Button
              onClick={() => {
                setSlippageInput('')
                setRawSlippage(10)
              }}
              fontFamily="UbuntuBold"
              style={{ background: rawSlippage === 10 ? '#FFB300' : '#8F9395', color: rawSlippage === 10 ? '#FFF' : '#110518', fontSize: "20px" }}
            >
              0.1%
            </Button>
            <Button
              onClick={() => {
                setSlippageInput('')
                setRawSlippage(50)
              }}
              fontFamily="UbuntuBold"
              style={{ background: rawSlippage === 50 ? '#FFB300' : '#8F9395', color: rawSlippage === 50 ? '#FFF' : '#110518', fontSize: "20px" }}
            >
              0.5%
            </Button>
            <Button
              onClick={() => {
                setSlippageInput('')
                setRawSlippage(100)
              }}
              fontFamily="UbuntuBold"
              style={{ background: rawSlippage === 100 ? '#FFB300' : '#8F9395', color: rawSlippage === 100 ? '#FFF' : '#110518', fontSize: "20px" }}
            >
              1%
            </Button>
          </Grid>
          <RowBetween>
            <Input
              scale="lg"
              placeholder={(rawSlippage / 100).toFixed(2)}
              value={slippageInput}
              onBlur={() => {
                parseCustomSlippage((rawSlippage / 100).toFixed(2))
              }}
              onChange={(e) => parseCustomSlippage(e.target.value)}
              isWarning={!slippageInputIsValid}
              fontFamily="Ubuntu"
              // color="#110518"
              style={{ borderColor: slippageError === SlippageError.InvalidInput ? 'red' : slippageError === SlippageError.RiskyLow ? '#110518' : 'red' }}
              color={slippageError === SlippageError.InvalidInput ? 'red' : '#110518'}
              isSuccess={![10, 50, 100].includes(rawSlippage)}
            />
            <Text color="#110518" fontFamily="UbuntuBold" bold ml="8px">
              %
            </Text>
          </RowBetween>
        </Flex>
        {!!slippageError && (
          <RowBetween
            style={{
              fontSize: '14px',
              paddingTop: '7px',
              fontFamily: 'UbuntuBold',
              color: slippageError === SlippageError.InvalidInput ? 'red' : slippageError === SlippageError.RiskyLow ? '#F3841E' : 'red',
            }}
          >
            {slippageError === SlippageError.InvalidInput
              ? t('Enter a valid slippage percentage')
              : slippageError === SlippageError.RiskyLow
                ? t('Your transaction may fail')
                : t('Your transaction may be frontrun')}
          </RowBetween>
        )}
      </AutoColumn>

      <AutoColumn gap="sm">
        <RowFixed>
          <Text color="#110518" fontSize="15px" fontFamily="UbuntuBold">{t('Transaction deadline')}</Text>
        </RowFixed>
        <RowFixed>
          <Input
            color={deadlineError ? 'red' : undefined}
            onBlur={() => {
              parseCustomDeadline((deadline / 60).toString())
            }}
             
            style={{ width:"25%", textAlign:"right", background: 'rgb(143, 147, 149)'}}
            fontFamily="Ubuntu"
            placeholder={(deadline / 60).toString()}
            value={deadlineInput}
            onChange={(e) => parseCustomDeadline(e.target.value)}
          />
          <Text color="#110518" pl="8px" fontSize="18px"  fontFamily="UbuntuBold">
            {t('minutes')}
          </Text>
        </RowFixed>
      </AutoColumn>
    </AutoColumn>
  )
}

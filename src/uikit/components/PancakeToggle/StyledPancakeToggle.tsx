import styled from 'styled-components'
import { scales, PancakeToggleProps, HandleProps, InputProps, ScaleKeys } from './types'

const scaleKeyValues = {
  sm: {
    pancakeSize: '16px', // The size of a pancake (the handle)
    travelDistance: '16px', // How far pancakes should travel horizontally
    toggleHeight: '20px', // General Height and
    toggleWidth: '36px', // Width of a toggle box
    pancakeThickness: '1px', // Bottom shadow of a pancake
    pancakeTwoOffset: '0px', // Pancakes don't look good when they are concentric
    pancakeThreeOffset: '-3px', // so pancake 2 and 3 are shifted a little bit
    butterTop: '3px', // Fine adjustments for butter position
    butterLeft: '10px',
    butterWidth: '6px', // Widht and
    butterHeight: '5px', // Height of a butter block on top of pancakes
    butterThickness: '0.5px', // Shadow on the bottom of the butter block
    butterRadius: '2px', // Rounded corners for the butter
    butterSmearOneTop: '10px', // There is melted butter
    butterSmearOneLeft: '2.5px', // next to the butter block
    butterSmearTwoTop: '11px', // implemented with :before and :after
    butterSmearTwoRight: '2.5px', // these values adjust the position of it
  },
  md: {
    pancakeSize: '40px',
    travelDistance: '42px',
    toggleHeight: '40px',
    toggleWidth: '85px',
    pancakeThickness: '2px',
    pancakeTwoOffset: '-3px',
    pancakeThreeOffset: '-8px',
    butterTop: '3px',
    butterLeft: '16px',
    butterWidth: '12px',
    butterHeight: '11px',
    butterThickness: '1px',
    butterRadius: '4px',
    butterSmearOneTop: '20px',
    butterSmearOneLeft: '5px',
    butterSmearTwoTop: '22px',
    butterSmearTwoRight: '5px',
  },
}

const getScale =
  (property: ScaleKeys) =>
  ({ scale = scales.MD }: PancakeToggleProps) => {
    return scaleKeyValues[scale][property]
  }

export const PancakeStack = styled.div<HandleProps>`
  position: relative;
  display: inline-block;

  &:label:before {
    content: none;
  }

  .pancakes {
    transition: 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .pancake {
    background: #4E4E9D;
    border-radius: 10px;
    width: ${getScale('pancakeSize')};
    height: ${getScale('pancakeSize')};
    position: absolute;
    transition: 0.4s ease;
    top: 0px;
    left: 2px;
    box-shardow: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #FFF;
    font-family: 'Ubuntu';
  }
  .pancake_on{
    width: ${getScale('pancakeSize')};
    height: ${getScale('pancakeSize')};
    position: absolute;
    top: 12px;
    left: 9px;
    justify-content: center;
    align-items: center;
    color: #FFF;
    font-family: 'Ubuntu';
  }
  .pancake_off{
    transform: translateX(${getScale('travelDistance')});
    width: ${getScale('pancakeSize')};
    height: ${getScale('pancakeSize')};
    position: absolute;
    top: 12px;
    left: 9px;
    justify-content: center;
    align-items: center;
    color: #FFF;
    font-family: 'Ubuntu';
  }
  .pancake:nth-child(1) {
    background: #4E4E9D;
    box-shadow: 0;
  }
`

export const PancakeInput = styled.input<InputProps>`
  height: 40px;
  left: 0;
  opacity: 0;
  position: absolute;
  top: 0;
  width: 40px;
  background: #565A69;

  &:focus + label {
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  &:checked + label .pancakes {
    transform: translateX(${getScale('travelDistance')});
  }

  &:checked + label .pancake:nth-child(1) {
    background: #4E4E9D;
    box-shadow: 0;
    transition-delay: 0.2s;
  }
`

export const PancakeLabel = styled.label<PancakeToggleProps>`
  width: ${getScale('toggleWidth')};
  height: ${getScale('toggleHeight')};
  background: #8F9395;
  box-shadow: 0;
  display: inline-block;
  border-radius: 10px;
  position: relative;
  transition: all 0.3s ease;
  transform-origin: 20% center;
  cursor: pointer;
`

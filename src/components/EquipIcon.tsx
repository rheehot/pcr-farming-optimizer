import styled, { css } from 'astroturf';
import React from 'react';

import Icon from './Icon';

interface WrapperProps {
  size: 'xsmall' | 'small' | 'medium' | 'large';
  dimInactive?: boolean;
}

const Wrapper = styled('label')<WrapperProps>`
  display: block;
  width: 100%;
  height: 100%;
  position: relative;

  > input {
    appearance: none;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &.dimInactive > input {
    background-color: rgba(black, 0.5);

    &:checked {
      background-color: transparent;
    }
  }

  $base-radius: 8px;
  $sizes: ('xsmall': 0.375, 'small': 0.5, 'medium': 0.75, 'large': 1);

  @each $name, $scale in $sizes {
    &.size-#{$name} > input {
      border-radius: $base-radius * $scale;
    }
  }
`;

const Addon = styled('div')<Pick<WrapperProps, 'size'>>`
  position: absolute;
  right: 0;
  bottom: 0;
  max-width: 100%;
  max-height: 100%;

  $base-padding: 8px;
  $sizes: ('xsmall': 0.375, 'small': 0.5, 'medium': 0.75, 'large': 1);

  @each $name, $scale in $sizes {
    &.size-#{$name} {
      padding: $base-padding * $scale;
    }
  }
`;

const styles = css`
  .inactiveIcon {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }
`;

interface Props {
  id: string;
  name: string;
  size: 'xsmall' | 'small' | 'medium' | 'large';
  active?: boolean;
  dimInactive?: boolean;
  onChange?(active: boolean): void;
  children?: React.ReactNode;
}

export default function EquipIcon(props: Props) {
  const { id, name, size, active, dimInactive, onChange, children } = props;
  const activeSrc = new URL(`/icons/equipment/${id}.png`, 'https://ames-static.tirr.dev');
  const inactiveSrc = new URL(`/icons/equipment/invalid/${id}.png`, 'https://ames-static.tirr.dev');
  const showActive = dimInactive ? true : Boolean(active);

  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.checked);
  }, [onChange]);
  return (
    <Wrapper size={size} dimInactive={dimInactive}>
      <Icon
        key={`${id}-active`}
        size={size}
        alt={name}
        src={activeSrc.toString()}
        style={{opacity: showActive ? 1 : 0}}
      />
      {!dimInactive && (
        <Icon
          key={`${id}-inactive`}
          size={size}
          alt={name}
          src={inactiveSrc.toString()}
          className={styles.inactiveIcon}
          style={{ opacity: showActive ? 0 : 1 }}
        />
      )}
      <Addon size={size}>{children}</Addon>
      <input type="checkbox" checked={active} onChange={handleChange} />
    </Wrapper>
  );
}

import { SvgIcon, SvgIconProps } from '@mui/material';
import { useId } from 'react';

const KepcoinIcon = (props: SvgIconProps) => {
  const rawId = useId();
  const maskId = rawId.replace(/:/g, '');

  return (
    <SvgIcon viewBox="0 0 100 100" {...props}>
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse">
          <rect x="0" y="0" width="100" height="100" fill="#fff" />
          <g fill="#000">
            <rect x="25" y="20" width="12" height="60" />
            <rect x="15" y="44" width="40" height="12" />
            <polygon points="40,50 70,20 82,20 52,50" />
            <polygon points="40,50 70,80 82,80 52,50" />
          </g>
        </mask>
      </defs>

      <circle cx="50" cy="50" r="48" fill="currentColor" mask={`url(#${maskId})`} />
    </SvgIcon>
  );
};

export default KepcoinIcon;

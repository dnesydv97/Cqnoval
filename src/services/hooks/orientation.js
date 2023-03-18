import {useLayoutEffect, useState} from 'react';
import OrientationLocker from 'react-native-orientation-locker';

import {Orientation} from 'constant';

export function useOrientationChange(isFocus) {
  const [orientation, setOrientation] = useState({
    type: '',
  });

  const handleOrientation = (orientation) => {
    let type;
    // console.log("handleOrientation", orientation);
    if (orientation === 'UNKNOWN' || orientation.includes('FACE')) return;
    if (orientation == 'PORTRAIT') {
      OrientationLocker.lockToPortrait();
      type = Orientation.PORTRAIT;
    } else {
      OrientationLocker.unlockAllOrientations();
      type = Orientation.LANDSCAPE;
    }
    setOrientation({type});
  };

  useLayoutEffect(() => {
    if (isFocus) {
      OrientationLocker.addDeviceOrientationListener(handleOrientation);
    } else {
      OrientationLocker.lockToPortrait();
    }

    return () => {
      OrientationLocker.removeDeviceOrientationListener(handleOrientation);
    };
  }, [isFocus]);

  return orientation;
}

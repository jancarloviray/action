import React, {PropTypes} from 'react';
import withStyles from 'universal/styles/withStyles';
import {css} from 'aphrodite-local-styles/no-important';
import tinycolor from 'tinycolor2';
import appTheme from 'universal/styles/theme/appTheme';
import {textOverflow} from 'universal/styles/helpers';

// TODO: add option for labels with icons
// import FontAwesome from 'react-fontawesome';

const MenuItem = (props) => {
  const {isActive, label, onClick, closeMenu, styles} = props;
  const rootStyles = css(styles.root, isActive && styles.active);
  const handleClick = () => {
    closeMenu();
    onClick();
  };
  return (
    <div className={rootStyles} onClick={handleClick} >
      <div className={css(styles.label)}>{label}</div>
    </div>
  );
};

MenuItem.propTypes = {
  closeMenu: PropTypes.func,
  isActive: PropTypes.bool,
  label: PropTypes.string,
  onClick: PropTypes.func,
  styles: PropTypes.object
};

const activeBackgroundColor = tinycolor.mix(appTheme.palette.mid, '#fff', 85).toHexString();
const hoverFocusStyles = {
  backgroundColor: appTheme.palette.mid10l,
  // for the blue focus outline
  outline: 0
};
const activeHoverFocusStyles = {
  backgroundColor: activeBackgroundColor,
  styles: PropTypes.object
};


const styleThunk = () => ({
  root: {
    backgroundColor: 'transparent',
    cursor: 'pointer',
    ':hover': {
      ...hoverFocusStyles
    },
    ':focus': {
      ...hoverFocusStyles
    }
  },

  active: {
    backgroundColor: activeBackgroundColor,
    cursor: 'default',

    ':hover': {
      ...activeHoverFocusStyles
    },
    ':focus': {
      ...activeHoverFocusStyles
    }
  },

  label: {
    ...textOverflow,
    color: appTheme.palette.dark,
    fontSize: appTheme.typography.s2,
    fontWeight: 700,
    lineHeight: '1.5rem',
    padding: '.25rem .5rem'
  }
});

export default withStyles(styleThunk)(MenuItem);

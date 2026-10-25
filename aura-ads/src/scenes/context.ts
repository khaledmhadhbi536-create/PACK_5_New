import {createContext, useContext} from 'react';
import {STYLES, StyleKey, StyleTheme} from '../theme/brand';

export const AdContext = createContext<{style: StyleKey; theme: StyleTheme}>({style: 'nat', theme: STYLES.nat});
export const useAd = () => useContext(AdContext);

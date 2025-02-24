import type { ThemeConfig } from 'antd';
import { colors } from './color';

export const theme: ThemeConfig = {
  token: {
    colorPrimary: colors.primary,
    colorSuccess: colors.green,
    colorWarning: colors.orange,
    colorError: colors.red,
    colorInfo: colors.info,
    
    colorText: colors.gray[800],
    colorTextSecondary: colors.gray[600],
    colorTextTertiary: colors.gray[500],
    colorTextQuaternary: colors.gray[400],
    
    colorBorder: colors.gray[100],
    colorBorderSecondary: colors.gray[200],
    colorBgContainer: colors.white,
    colorBgElevated: colors.white,
    colorBgLayout: colors.gray[50],
    colorBgSpotlight: colors.gray[50],
    
  },
  components: {
    Segmented: {
      itemSelectedBg: colors.primary,
      itemSelectedColor: colors.white,
    }
  }

};
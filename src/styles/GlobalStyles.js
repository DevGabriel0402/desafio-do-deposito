import { createGlobalStyle } from "styled-components";
import { hexToRgba } from "../utils/colors.js";

export const GlobalStyle = createGlobalStyle`
  *{ box-sizing: border-box; }
  html, body { height: 100%; }
  body{
    margin:0;
    font-family: ${({ theme }) => theme.font.body};
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
  }

  /* seleção mais bonita */
  ::selection{
    background: ${({ theme }) => hexToRgba(theme.colors.brand, 0.18)};
  }

  /* Toastify Overrides */
  :root {
    --toastify-color-info: ${({ theme }) => theme.colors.brand};
    --toastify-color-success: ${({ theme }) => theme.colors.brand};
    --toastify-color-warning: ${({ theme }) => theme.colors.warning};
    --toastify-color-error: ${({ theme }) => theme.colors.danger};
    
    /* Progress bar color for info/default */
    --toastify-color-progress-info: ${({ theme }) => theme.colors.brand};
    --toastify-color-progress-success: ${({ theme }) => theme.colors.brand};
    --toastify-color-progress-warning: ${({ theme }) => theme.colors.warning};
    --toastify-color-progress-error: ${({ theme }) => theme.colors.danger};
    --toastify-color-progress-bar: ${({ theme }) => hexToRgba(theme.colors.brand, 0.7)};
    
    /* Icon color */
    --toastify-icon-color-info: ${({ theme }) => theme.colors.brand};
    --toastify-icon-color-success: ${({ theme }) => theme.colors.brand};
    --toastify-icon-color-warning: ${({ theme }) => theme.colors.warning};
    --toastify-icon-color-error: ${({ theme }) => theme.colors.danger};
  }
`;

import styled from "styled-components";

export const Button = styled.button`
  border: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.space(1.25)} ${({ theme }) => theme.space(1.75)};
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.08s ease, opacity 0.2s ease, background 0.2s ease;

  &:active { transform: scale(0.98); }
  &:disabled { opacity: 0.55; cursor: not-allowed; }

  ${({ variant, theme }) => {
        if (variant === "ghost") {
            return `
        background: transparent;
        color: ${theme.colors.text};
        border: 1px solid ${theme.colors.border};
      `;
        }
        if (variant === "danger") {
            return `
        background: ${theme.colors.danger};
        color: #111;
      `;
        }
        return `
      background: ${theme.colors.brand};
      color: white;
      
      &:hover {
        background: ${theme.colors.brand2};
      }
    `;
    }}
`;

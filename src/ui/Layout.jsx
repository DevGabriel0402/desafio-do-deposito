import styled from "styled-components";

export const Shell = styled.div`
  max-width: 1080px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.space(3)};
  padding-bottom: calc(${({ theme }) => theme.space(12)} + env(safe-area-inset-bottom));
`;

export const Grid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space(2)};
`;

import styled from "styled-components";
import ProductBox from "./ProductBox";



const StyleProductsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;  
  }
`;

export default function ProductGrid({ products }) {
  return (
    <StyleProductsGrid>
      {products?.length > 0 &&
        products.map((product) => (
          <ProductBox key={product._id} {...product} />
        ))}
    </StyleProductsGrid>
  );
}

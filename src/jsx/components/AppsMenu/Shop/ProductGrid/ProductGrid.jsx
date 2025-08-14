import React, { Fragment } from 'react';

import PageTitle from '../../../../layouts/PageTitle';
/// Data
import productData from '../productData';
import Products from './Products';

const ProductGrid = () => {
  return (
    <Fragment>
      <PageTitle pageContent="Product Grid" activeMenu="Product Grid" motherMenu="Shop" />
      <div className="row">
        {productData.map(product => (
          <Products key={product.key} product={product} />
        ))}
      </div>
    </Fragment>
  );
};

export default ProductGrid;

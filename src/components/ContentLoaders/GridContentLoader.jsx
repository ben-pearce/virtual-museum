import React from 'react';
import ContentLoader from 'react-content-loader';

const GridContentLoader = (props) => (
  <ContentLoader 
    speed={2}
    width="100%"
    height="100%"
    viewBox="0 0 160 170"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="0" y="0" rx="5" ry="5" width="160" height="102" /> 
    <rect x="0" y="113" rx="0" ry="0" width="160" height="14" /> 
    <rect x="0" y="133" rx="0" ry="0" width="90" height="14" /> 
    <rect x="0" y="155" rx="0" ry="0" width="140" height="10" />
  </ContentLoader>
);

export default GridContentLoader;
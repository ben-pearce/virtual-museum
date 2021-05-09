import React from 'react';
import ContentLoader from 'react-content-loader';

/**
 * A content loader skeleton definition for when list objects are being loaded.
 * Displayed to the user while content is loading in the background.
 *
 * @returns {ReactNode} The {@link ContentLoader} react node.
 */
const ListContentLoader = () => (
  <ContentLoader 
    speed={2}
    width='100%'
    height='100%'
    viewBox='0 0 550 130'
    backgroundColor='#f3f3f3'
    foregroundColor='#ecebeb'
  >
    <circle cx='20' cy='20' r='20' /> 
    <rect x='0' y='0' rx='10' ry='10' width='130' height='114' /> 
    <rect x='140' y='6' rx='0' ry='0' width='358' height='20' /> 
    <rect x='140' y='37' rx='0' ry='0' width='156' height='14' /> 
    <rect x='140' y='58' rx='0' ry='0' width='61' height='14' />
  </ContentLoader>
);

export default ListContentLoader;
import React from 'react';

const RootTemplate = (props: {
  children: React.ReactNode;
}) => {
  return (
    <main>{props.children}</main>
  );
  // hello
};

export default RootTemplate;

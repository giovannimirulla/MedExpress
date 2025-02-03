import type { ViewConfig } from '@vaadin/hilla-file-router/types.js';


export const config: ViewConfig = {
  title: 'Order',
  loginRequired: true,
};

export default function Order() {
  return (
    <div className="flex flex-col">
      <h1>Order</h1>
    </div>
  );
}

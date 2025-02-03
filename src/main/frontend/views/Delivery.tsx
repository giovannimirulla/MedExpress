import type { ViewConfig } from '@vaadin/hilla-file-router/types.js';


export const config: ViewConfig = {
  title: 'Delivery',
  rolesAllowed: ["USER", "ADMIN"],
};

export default function Delivery() {
  return (
    <div className="flex flex-col">
      <h1>Delivery</h1>
    </div>
  );
}

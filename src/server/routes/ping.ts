import { createRouteHandlers } from '../middlewares/route-handler';
import { RouteHandlers } from '../../types/route-handler';

export const ping: RouteHandlers = createRouteHandlers({
  handle: () => 'NEAR AI Cloud Server',
});

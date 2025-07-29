import { HttpStatusColor } from '../types/color';

export function getHttpStatusColor(statusCode: number): HttpStatusColor {
  if (statusCode >= 200 && statusCode < 300) {
    return 'green';
  } else if (statusCode >= 300 && statusCode < 400) {
    return 'blue';
  } else if (statusCode >= 400 && statusCode < 500) {
    return 'yellow';
  } else if (statusCode >= 500 && statusCode < 600) {
    return 'red';
  } else {
    return 'gray';
  }
}

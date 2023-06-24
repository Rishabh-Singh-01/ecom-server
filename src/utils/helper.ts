export function getSqlOperator(operator: string) {
  switch (operator) {
    case 'eq':
      return '=';
    case 'gt':
      return '>';
    case 'gte':
      return '>=';
    case 'lt':
      return '<';
    case 'lte':
      return '<=';
    default:
      return null;
  }
}

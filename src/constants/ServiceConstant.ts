export abstract class ErrorMessages {
  static readonly PROVIDE_VALID_PARAMETERS = 'Please Provide Valid Parameters!';
  static readonly INTERNAL_SERVER_ERROR =
    'Internal Server Error! Please try again.';
}

export abstract class ErrorCodes {
  static readonly BAD_REQUEST_ERROR_CODE = 400;
  static readonly INTERNAL_SERVER_ERROR_CODE = 500;
}

export abstract class CustomErrorMessages {
  static readonly QUANTITY_MORE_THAN_STOCK =
    'Provided Quantity for a product is more than stocked quantity.';
  static readonly SIZE_NOT_AVAILABLE =
    'Provided size for this product is not available';
}

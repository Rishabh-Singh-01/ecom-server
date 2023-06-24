import { AppError } from './AppError';
import { getSqlOperator } from './helper';
import { ErrorMessages } from '../constants/ServiceConstant';

export class APIFeatures {
  query: any;
  queryString: string;
  // Filtering paper which Only filtered through a certain fields
  // :TODO(l) - Apply more filtering fields
  filterFields = [
    'name',
    'price',
    'category_name',
    'size_name',
    'size_description',
  ];
  parameters: (string | number)[] = [];

  constructor(query: any, queryString: string) {
    this.query = query;
    this.queryString = queryString;
  }
  // 1) Filtering -
  filter() {
    // creating query parameter for filtering
    for (const field in this.query) {
      // incase filter field is not a certain fields eg sort,page
      if (!this.filterFields.includes(field)) continue;

      if (typeof field !== 'string')
        throw new AppError(ErrorMessages.PROVIDE_VALID_PARAMETERS, 400);

      // if the filter matches direct equals
      if (field === 'category_name' || field === 'size_name') {
        if (typeof this.query[field] !== 'string')
          throw new AppError(ErrorMessages.PROVIDE_VALID_PARAMETERS, 400);
        this.queryString += ` AND ${field} = ?`;
        this.parameters.push(this.query[field]);
      }

      // if filter matches like not equal
      if (field === 'size_description' || field === 'name') {
        if (typeof this.query[field] !== 'string')
          throw new AppError(ErrorMessages.PROVIDE_VALID_PARAMETERS, 400);
        this.queryString += ` AND ${field} LIKE '%?%'`;
        this.parameters.push(this.query[field]);
      }

      // if filter could be a greater/less or equal
      if (field === 'price') {
        // incase price is directly matched and no greater/lesser operator is used
        if (typeof this.query[field] === 'string') {
          this.queryString += ` AND ${field} = ?`;
          this.parameters.push(this.query[field]);
          continue;
        }

        // if the sql operators are used for comparisons
        const priceObj = JSON.parse(JSON.stringify(this.query[field])); // converting the this.query in json obj
        for (const operator in priceObj) {
          if (getSqlOperator(operator) === null)
            throw new AppError(ErrorMessages.PROVIDE_VALID_PARAMETERS, 400);
          this.queryString += ` AND ${field} ${getSqlOperator(operator)} ?`;
          this.parameters.push(priceObj[operator]);
        }
      }
    }
    return this;
  }
  // 2) Sorting
  sort() {
    // :TODO(p) - Test for sort two and string type params eg: -price,-size_name
    if (this.query.sort) {
      if (typeof this.query.sort !== 'string')
        throw new AppError(ErrorMessages.PROVIDE_VALID_PARAMETERS, 400);

      this.queryString += ' ORDER BY ';
      this.query.sort.split(',').forEach((sortBy: string) => {
        const sortByField = sortBy.startsWith('-') ? sortBy.slice(1) : sortBy;
        if (!this.filterFields.includes(sortByField))
          throw new AppError(ErrorMessages.PROVIDE_VALID_PARAMETERS, 400);
        const sortDirection = sortBy.startsWith('-') ? 'DESC' : 'ASC';
        this.queryString += ` ${sortByField} ${sortDirection}, `;
      });
    } else {
      this.queryString += ' ORDER BY ';
      this.queryString += ' price DESC, ';
    }
    this.queryString = this.queryString.slice(0, -2); // removing the last comma and space

    return this;
  }

  // 3) Pagination
  paginate() {
    // check for security purpose and type safety
    if (this.query.page !== undefined && typeof this.query.page !== 'string')
      throw new AppError(ErrorMessages.PROVIDE_VALID_PARAMETERS, 400);
    if (this.query.limit !== undefined && typeof this.query.limit !== 'string')
      throw new AppError(ErrorMessages.PROVIDE_VALID_PARAMETERS, 400);
    const page = +(this.query.page || '1');
    const limit = +(this.query.limit || '2');
    const skip = (page - 1) * limit;

    this.queryString += ' LIMIT ? OFFSET ?';
    this.parameters.push(limit);
    this.parameters.push(skip);

    return this;
  }
}

// // 1) Filtering -
// // Filtering paper which Only filtered through a certain fields
// // :TODO(l) - Apply more filtering fields
// const filterFields = [
//   'name',
//   'price',
//   'category_name',
//   'size_name',
//   'size_description',
// ];

// // creating query parameter for filtering
// for (const field in req.query) {
//   // incase filter field is not a certain fields eg sort,page
//   if (!filterFields.includes(field)) continue;

//   if (typeof field !== 'string')
//     throw new AppError('Please Provide Valid Parameters', 400);

//   // if the filter matches direct equals
//   if (field === 'category_name' || field === 'size_name') {
//     if (typeof req.query[field] !== 'string')
//       throw new AppError('Please Provide Valid Parameters', 400);
//     getAllProductsQuery += ` AND ${field} = ?`;
//     queryParameters.push(req.query[field]);
//   }

//   // if filter matches like not equal
//   if (field === 'size_description' || field === 'name') {
//     if (typeof req.query[field] !== 'string')
//       throw new AppError('Please Provide Valid Parameters', 400);
//     getAllProductsQuery += ` AND ${field} LIKE '%?%'`;
//     queryParameters.push(req.query[field]);
//   }

//   // if filter could be a greater/less or equal
//   if (field === 'price') {
//     // incase price is directly matched and no greater/lesser operator is used
//     if (typeof req.query[field] === 'string') {
//       getAllProductsQuery += ` AND ${field} = ?`;
//       queryParameters.push(req.query[field]);
//       continue;
//     }

//     // if the sql operators are used for comparisons
//     const priceObj = JSON.parse(JSON.stringify(req.query[field])); // converting the req.query in json obj
//     for (const operator in priceObj) {
//       if (getSqlOperator(operator) === null)
//         throw new AppError('Please Provide Valid Parameters', 400);
//       getAllProductsQuery += ` AND ${field} ${getSqlOperator(operator)} ?`;
//       queryParameters.push(priceObj[operator]);
//     }
//   }
// }

// // 2) Sorting
// // :TODO(p) - Test for sort two and string type params eg: -price,-size_name
// console.log(req.query.sort);
// if (req.query.sort) {
//   if (typeof req.query.sort !== 'string')
//     throw new AppError('Please Provide Valid Parameters', 400);

//   getAllProductsQuery += ' ORDER BY ';
//   req.query.sort.split(',').forEach((sortBy) => {
//     const sortByField = sortBy.startsWith('-') ? sortBy.slice(1) : sortBy;
//     if (!filterFields.includes(sortByField))
//       throw new AppError('Please Provide Valid Parameters', 400);
//     const sortDirection = sortBy.startsWith('-') ? 'DESC' : 'ASC';
//     getAllProductsQuery += ` ${sortByField} ${sortDirection}, `;
//   });
// } else {
//   getAllProductsQuery += ' ORDER BY ';
//   getAllProductsQuery += ' price DESC, ';
// }
// getAllProductsQuery = getAllProductsQuery.slice(0, -2); // removing the last comma and space

// // 3) Pagination
// // check for security purpose and type safety
// if (req.query.page !== undefined && typeof req.query.page !== 'string')
//   throw new AppError('Please Provide Valid Parameters', 400);
// if (req.query.limit !== undefined && typeof req.query.limit !== 'string')
//   throw new AppError('Please Provide Valid Parameters', 400);
// const page = +(req.query.page || '1');
// const limit = +(req.query.limit || '2');
// const skip = (page - 1) * limit;

// // :TODO(q) Since this makes a db call is it necessary to throw error or we are happy with a response with data a none
// if (req.query.page) {
//   const [rows] = await db.query<RowDataPacket[]>(
//     getAllProductsQuery,
//     queryParameters
//   );
//   if (skip >= rows.length)
//     throw new AppError('This page does not exist', 400);
// }

// getAllProductsQuery += ' LIMIT ? OFFSET ?';
// queryParameters.push(limit);
// queryParameters.push(skip);

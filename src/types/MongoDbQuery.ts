import { ObjectId } from 'mongoose'

// Define the basic types for the values that the operators can accept
type FieldValue = string | number | boolean | Date | ObjectId // You can extend this with other types as needed

// Define the MongoDB comparison operators
interface ComparisonOperators {
  $eq?: FieldValue // Equal
  $ne?: FieldValue // Not equal
  $gt?: FieldValue // Greater than
  $gte?: FieldValue // Greater than or equal to
  $lt?: FieldValue // Less than
  $lte?: FieldValue // Less than or equal to
  $in?: FieldValue[] // In an array of values
  $nin?: FieldValue[] // Not in an array of values
  $regex?: string | RegExp // Regular expression match (string type)
  $exists?: boolean // Whether the field exists or not
  $type?: string | number // Field type (e.g., "string", "number")
}

// Utility type to map fields to comparison operators
export type MongoDbQuery<T> = T extends FieldValue ? ComparisonOperators : never // In case we extend to more complex fields, adjust this type accordingly

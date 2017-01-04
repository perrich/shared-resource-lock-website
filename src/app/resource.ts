/**
 * Resource
 */
export class Resource {
  /**
   * Identifier
   */
  id: number;
  /**
   * Type
   */
  type: string;

  /**
   * Sub-type
   */
  subtype: string;

  /**
   * Name
   */
  name: string;

  /**
   * Description
   */
  description: string | null;

  /**
   * Comment of the user
   */
  comment: string | null;

  /**
   * User who hold the resource
   */
  user: string | null;

  /**
   * Holding date
   */
  date: Date | null;
}
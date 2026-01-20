/**
 * Pagination DTO
 *
 * Represents pagination metadata for list responses
 */
export interface PaginationDTO {
  page: number
  limit: number
  total: number
  totalPages: number
}

/**
 * Paginated Response DTO
 *
 * Generic wrapper for paginated list responses
 */
export interface PaginatedResponseDTO<T> {
  data: T[]
  pagination: PaginationDTO
}

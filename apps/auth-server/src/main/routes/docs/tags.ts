export enum TAGS {
  CUSTOMERS = 'Customers',
  HEALTH = 'Health'
}

export const tags: Array<{ name: TAGS; description: string }> = [
  {
    name: TAGS.CUSTOMERS,
    description: 'Customer related endpoints'
  },
  {
    name: TAGS.HEALTH,
    description: 'Health check endpoints'
  }
]

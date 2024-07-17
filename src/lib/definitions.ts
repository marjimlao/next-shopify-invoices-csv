export type Order = {
  name?: string,
  header: {
    number: string,
    date: string,
    shippingInfo: {
      name: string,
      nif: string,
      address: string,
      address2: string,
      zip: string,
      city: string,
      province: string,
      phone: string,
      email: string,
    },
    billingInfo: {
      name: string,
      nif: string,
      address: string,
      address2: string,
      zip: string,
      city: string,
      province: string,
      phone: string,
      email: string,
    }
  },
  lines: Array<{
    title: string,
    quantity: number,
    price: string
  }>,
  totals: {
    taxes: string,
    discount: string,
    shipping: string | number,
    subtotal: string,
    total: string,
  }
}
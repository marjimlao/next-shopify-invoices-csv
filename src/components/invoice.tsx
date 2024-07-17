import { Order } from '@/lib/definitions';
import { Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

Font.register({
  family: 'Open Sans',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf', fontWeight: 600 }
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 35,
    fontSize: 10,
    fontFamily: 'Open Sans'
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottom: 1,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    marginBottom: 12
  },
  logo: {
    width: '40%'
  },
  img: {
    width: 150
  },
  invoiceNumber: {
    flexDirection: 'column',
    width: '30%'
  },
  invoiceDate: {
    flexDirection: 'column',
    width: '30%'
  },
  bold: {
    fontWeight: 600
  },
  invoiceDetails: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    marginBottom: 12,
    paddingBottom: 12
  },
  address: {
    width: '50%',
    flexDirection: 'column'
  },
  invoiceLines: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 12,
    paddingBottom: 12
  },
  invoiceLine: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  invoiceLineTitle: {
    width: '55%',
  },
  invoiceLineQuantity: {
    width: '12%',
    textAlign: 'center'
  },
  invoiceLineUnitPrice: {
    width: '23%',
    textAlign: 'right'
  },
  invoiceLineTotal: {
    width: '10%',
    textAlign: 'right'
  },
  invoiceTotals: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 12,
    paddingBottom: 12
  },
  invoiceTotalGap: {
    width: '60%',
  },
  invoiceTotalName: {
    width: '20%',
  },
  invoiceTotalValue: {
    width: '20%',
    textAlign: 'right'
  },
  invoiceTotalNameTaxes: {
    width: '20%',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    borderBottomStyle: 'solid'
  },
  invoiceTotalValueTaxes: {
    width: '20%',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    borderBottomStyle: 'solid',
    textAlign: 'right'
  },
  footer: {
    flexDirection: 'column',
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    borderTopStyle: 'solid',
    paddingTop: 5
  },
});

export default function Invoice(params: { logo: string, businessName: string, businessID: string, businessAddress: string, order: Order }) {

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View style={styles.logo}>
          <Image
            style={styles.img}
            src={params.logo}
          />
        </View>
        <View style={styles.invoiceNumber}>
          <Text style={styles.bold}>NÚMERO DE FACTURA</Text>
          <Text>{params.order.header.number}</Text>
        </View>
        <View style={styles.invoiceDate}>
          <Text style={styles.bold}>FECHA DE FACTURA</Text>
          <Text>{params.order.header.date}</Text>
        </View>
      </View>
      <View style={styles.invoiceDetails}>
        <View style={styles.address}>
          <Text style={styles.bold}>DETALLES DE ENVÍO</Text>
          <Text>{params.order.header.shippingInfo.name}</Text>
          <Text>{params.order.header.shippingInfo.nif ?? ''}</Text>
          <Text>{params.order.header.shippingInfo.address}</Text>
          <Text>{params.order.header.shippingInfo.address2 ?? ''}</Text>
          <Text>{params.order.header.shippingInfo.zip.replace("'", "")} {params.order.header.shippingInfo.city}</Text>
          <Text>{params.order.header.shippingInfo.province}</Text>
          <Text>{params.order.header.shippingInfo.phone}</Text>
          <Text>{params.order.header.shippingInfo.email}</Text>
        </View>
        <View style={styles.address}>
          <Text style={styles.bold}>DETALLES DE FACTURACIÓN</Text>
          <Text>{params.order.header.billingInfo.name}</Text>
          <Text>{params.order.header.billingInfo.nif ?? ''}</Text>
          <Text>{params.order.header.billingInfo.address}</Text>
          <Text>{params.order.header.billingInfo.address2 ?? ''}</Text>
          <Text>{params.order.header.billingInfo.zip.replace("'", "")} {params.order.header.billingInfo.city}</Text>
          <Text>{params.order.header.billingInfo.province}</Text>
          <Text>{params.order.header.billingInfo.phone}</Text>
          <Text>{params.order.header.billingInfo.email}</Text>
        </View>
      </View>
      <View style={styles.invoiceLines}>
        <View style={styles.invoiceLine}>
          <View style={styles.invoiceLineTitle}>
            <Text style={styles.bold}>TÍTULO</Text>
          </View>
          <View style={styles.invoiceLineQuantity}>
            <Text style={styles.bold}>CANTIDAD</Text>
          </View>
          <View style={styles.invoiceLineUnitPrice}>
            <Text style={styles.bold}>PRECIO UNITARIO</Text>
          </View>
          <View style={styles.invoiceLineTotal}>
            <Text style={styles.bold}>TOTAL</Text>
          </View>
        </View>
        {params.order.lines.map((l, index) => {
          return (
            <View key={index} style={styles.invoiceLine}>
              <View style={styles.invoiceLineTitle}>
                <Text>{l.title}</Text>
              </View>
              <View style={styles.invoiceLineQuantity}>
                <Text>{l.quantity}</Text>
              </View>
              <View style={styles.invoiceLineUnitPrice}>
                <Text>{(+l.price).toFixed(2)} €</Text>
              </View>
              <View style={styles.invoiceLineTotal}>
                <Text>{(+l.price * +l.quantity).toFixed(2)} €</Text>
              </View>
            </View>
          )
        })}

      </View>

      <View style={styles.invoiceTotals}>
        {+params.order.totals.discount > 0 &&
          <View style={styles.invoiceLine}>
            <View style={styles.invoiceTotalGap}></View>
            <View style={styles.invoiceTotalName}>
              <Text style={styles.bold}>DESCUENTO</Text>
            </View>
            <View style={styles.invoiceTotalValue}>
              <Text>-{(+params.order.totals.discount).toFixed(2)} €</Text>
            </View>
          </View>
        }
        <View style={styles.invoiceLine}>
          <View style={styles.invoiceTotalGap}></View>
          <View style={styles.invoiceTotalName}>
            <Text style={styles.bold}>SUBTOTAL</Text>
          </View>
          <View style={styles.invoiceTotalValue}>
            <Text>{(+params.order.totals.subtotal).toFixed(2)} €</Text>
          </View>
        </View>
        {+params.order.totals.shipping > 0 &&
          <View style={styles.invoiceLine}>
            <View style={styles.invoiceTotalGap}></View>
            <View style={styles.invoiceTotalName}>
              <Text style={styles.bold}>ENVÍO</Text>
            </View>
            <View style={styles.invoiceTotalValue}>
              <Text>{(+params.order.totals.shipping).toFixed(2)} €</Text>
            </View>
          </View>
        }
        <View style={styles.invoiceLine}>
          <View style={styles.invoiceTotalGap}></View>
          <View style={styles.invoiceTotalNameTaxes}>
            <Text style={styles.bold}>IMPUESTOS</Text>
          </View>
          <View style={styles.invoiceTotalValueTaxes}>
            <Text>{(+params.order.totals.taxes).toFixed(2)} €</Text>
          </View>
        </View>
        <View style={styles.invoiceLine}>
          <View style={styles.invoiceTotalGap}></View>
          <View style={styles.invoiceTotalName}>
            <Text style={styles.bold}>TOTAL</Text>
          </View>
          <View style={styles.invoiceTotalValue}>
            <Text>{(+params.order.totals.total).toFixed(2)} €</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text>{params.businessName}</Text>
        <Text>{params.businessID}</Text>
        <Text>{params.businessAddress}</Text>
      </View>
    </Page>
  );
}
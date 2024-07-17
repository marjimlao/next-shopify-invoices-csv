'use client';

import { Document } from '@react-pdf/renderer';

import dynamic from "next/dynamic";
import Invoice from './invoice';
import { Order } from '@/lib/definitions';

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  },
);

export default function Invoices(params: { logo: string, businessName: string, businessID: string, businessAddress: string, orders: Array<Order> }) {
  const GenerateInvoices = () => {
    return (
      <Document>
        {params.orders.map((order, index) => {
          return <Invoice key={index} logo={params.logo} businessName={params.businessName} businessID={params.businessID} businessAddress={params.businessAddress} order={order} />
        })}
      </Document>
    )
  }

  return (
    <section className='mt-12'>
      <PDFViewer width={210 * 3} height={297 * 3}>
        <GenerateInvoices />
      </PDFViewer>
    </section>
  );
}

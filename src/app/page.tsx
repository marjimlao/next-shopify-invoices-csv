'use client';

import { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import csv from 'csvtojson';
import moment from 'moment';

import Invoices from '@/components/invoices'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

import { Order } from '@/lib/definitions';

const FormSchema = z.object({
  logo: z.string().url(),
  businessName: z.string().min(1),
  businessID: z.string().min(1),
  businessAddress: z.string().min(1),
  prefix: z.string().optional(),
  number: z.coerce.number().min(1),
  suffix: z.string().optional(),
  csv: z.instanceof(File)
    .optional()
    .refine((file) => {
      return file;
    }, 'File is required.')
})

export default function Csv() {
  const [logo, setLogo] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessID, setBusinessID] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [orders, setOrders] = useState<Array<Order>>([]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      logo,
      businessName,
      businessID,
      businessAddress,
      prefix: '',
      number: 1,
      suffix: '',
    },
  })

  useEffect(() => {
    const logo = localStorage.getItem('logo') || '';
    const businessName = localStorage.getItem('businessName') || '';
    const businessID = localStorage.getItem('businessID') || '';
    const businessAddress = localStorage.getItem('businessAddress') || '';

    form.setValue('logo', logo);
    form.setValue('businessName', businessName);
    form.setValue('businessID', businessID);
    form.setValue('businessAddress', businessAddress);

    setLogo(logo);
    setBusinessName(businessName);
    setBusinessID(businessID);
    setBusinessAddress(businessAddress);
  }, []);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setOrders([]);

    setLogo(data.logo);
    setBusinessName(data.businessName);
    setBusinessID(data.businessID);
    setBusinessAddress(data.businessAddress);

    localStorage.setItem('logo', data.logo);
    localStorage.setItem('businessName', data.businessName);
    localStorage.setItem('businessID', data.businessID);
    localStorage.setItem('businessAddress', data.businessAddress);

    const reader = new FileReader();

    reader.onloadend = async ({ target }) => {
      const jsonArray = await csv().fromString(target?.result?.toString() ?? '');

      const result: Array<Order> = [];

      let invoice: Order = {
        header: {
          number: '',
          date: '',
          shippingInfo: {
            name: '',
            nif: '',
            address: '',
            address2: '',
            zip: '',
            city: '',
            province: '',
            phone: '',
            email: '',
          },
          billingInfo: {
            name: '',
            nif: '',
            address: '',
            address2: '',
            zip: '',
            city: '',
            province: '',
            phone: '',
            email: '',
          }
        },
        lines: [],
        totals: {
          taxes: '',
          discount: '',
          shipping: '',
          subtotal: '',
          total: '',
        },
        name: ''
      };

      let previousOrder: any;

      for (let index = jsonArray.length - 1; index >= 0; index--) {
        const r = jsonArray[index];

        if (previousOrder === r.Name) {
          invoice.lines.push(
            {
              title: r['Lineitem name'],
              quantity: r['Lineitem quantity'],
              price: r['Lineitem price'],
            }
          );

          invoice.header.shippingInfo = {
            name: r['Shipping Name'],
            nif: r['Shipping Company'],
            address: r['Shipping Address1'],
            address2: r['Shipping Address2'],
            zip: r['Shipping Zip'],
            city: r['Shipping City'],
            province: r['Shipping Province Name'],
            phone: r['Shipping Phone'],
            email: r['Email'],
          };

          invoice.header.billingInfo = {
            name: r['Billing Name'],
            nif: r['Shipping Company'],
            address: r['Billing Address1'],
            address2: r['Billing Address2'],
            zip: r['Billing Zip'],
            city: r['Billing City'],
            province: r['Billing Province Name'],
            phone: r['Billing Phone'],
            email: r['Email'],
          };

          let subtotalLines = 0;
          invoice.lines.map(l => {
            subtotalLines += +l.price * +l.quantity
          });

          invoice.totals = {
            taxes: r.Taxes,
            // discount: r['Discount Amount'],
            discount: (subtotalLines - +r.Subtotal).toFixed(2),
            shipping: r.Shipping,
            subtotal: r.Subtotal,
            total: r.Total
          };
        } else {
          if (previousOrder) {
            result.push(invoice);
          }

          // console.log('currentnumber', currentNumber);
          previousOrder = r.Name;

          invoice = {
            name: r['Name'],
            header: {
              number: (data.prefix ?? '') + data.number + (data.suffix ?? ''),
              date: moment(r['Created at'], 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm:ss'),
              shippingInfo: {
                name: r['Shipping Name'],
                nif: r['Shipping Company'],
                address: r['Shipping Address1'],
                address2: r['Shipping Address2'],
                zip: r['Shipping Zip'],
                city: r['Shipping City'],
                province: r['Shipping Province Name'],
                phone: r['Shipping Phone'],
                email: r['Email'],
              },
              billingInfo: {
                name: r['Billing Name'],
                nif: r['Shipping Company'],
                address: r['Billing Address1'],
                address2: r['Billing Address2'],
                zip: r['Billing Zip'],
                city: r['Billing City'],
                province: r['Billing Province Name'],
                phone: r['Billing Phone'],
                email: r['Email'],
              }
            },
            lines: [
              {
                title: r['Lineitem name'],
                quantity: +r['Lineitem quantity'],
                price: r['Lineitem price'],
              }
            ],
            totals: {
              taxes: r.Taxes,
              // discount: r['Discount Amount'],
              discount: ((+r['Lineitem price'] * +r['Lineitem quantity']) - +r.Subtotal).toFixed(2),
              shipping: r.Shipping,
              subtotal: r.Subtotal,
              total: r.Total
            }
          }

          data.number = data.number + 1;
        }
      }

      result.push(invoice);

      setOrders(result);
    };

    reader.readAsText(data.csv);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-8 md:p-24">
      <h1 className='text-3xl mb-8 text-center'>Generar facturas Shopify desde CSV</h1>

      <p className='text-md text-slate-400 text-center mb-2'>Obten el archivo CSV de pedidos desde tu <a className='text-blue-600 underline' href="https://admin.shopify.com/" title="Acceso panel Shopify" target="_blank">panel de Shopify</a>, sección "Pedidos". Haz clic en la opción "Exportar", selecciona los pedidos para los que quieres generar las facturas y elige la opción "Archivo CSV simple". Por último haz clic en el botón "Exportar pedidos".</p>
      <p className='text-md text-slate-400 text-center mb-2'>Una vez tengas el archivo CSV, adjúntalo en este formulario e indica el número de factura que debe tener el primer pedido que has exportado.</p>
      <p className='text-md text-slate-400 text-center mb-8'>Indica también la URL al logo que incluirá la factura, así como tus datos de facturación (nombre de la empresa, NIF y dirección) que se incluirán en el pie de las facturas.</p>

      {form &&
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full md:w-2/3">
            <div className='flex flex-col items-center gap-4 w-full'>
              <strong className='text-xl'>Datos empresa</strong>

              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem className='w-full xl:w-3/4'>
                    <FormControl>
                      <Input className='w-full' type="text" placeholder="URL logo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem className='w-full xl:w-3/4'>
                    <FormControl>
                      <Input className='w-full' type="text" placeholder="Nombre empresa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessID"
                render={({ field }) => (
                  <FormItem className='w-full xl:w-3/4'>
                    <FormControl>
                      <Input className='w-full' type="text" placeholder="ID Empresa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessAddress"
                render={({ field }) => (
                  <FormItem className='w-full xl:w-3/4'>
                    <FormControl>
                      <Input className='w-full' type="text" placeholder="Dirección empresa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <strong className='text-xl'>Próximo número de factura</strong>

              <div className="flex flex-row items-start justify-center gap-1">
                <FormField
                  control={form.control}
                  name="prefix"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input className='w-20' type="text" placeholder="Prefijo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input className='w-32' type="number" placeholder="Número" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="suffix"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input className='w-20' type="text" placeholder="Sufijo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <strong className='text-xl'>Archivo</strong>

              <FormField
                control={form.control}
                name="csv"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormControl>
                      <Input className='w-full dark:file:text-foreground' type="file" accept="text/csv"
                        onChange={(event) =>
                          onChange(event.target.files && event.target.files[0])
                        } placeholder="Archivo CSV" {...fieldProps} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Generar</Button>
            </div>
          </form>
        </Form>
      }

      {orders.length > 0 && logo && businessName && businessID && businessAddress &&
        <Invoices logo={logo} businessName={businessName} businessID={businessID} businessAddress={businessAddress} orders={orders} />
      }
    </main>
  );
}

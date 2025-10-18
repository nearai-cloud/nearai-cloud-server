import { DstackClient } from '@phala/dstack-sdk';

export async function getQuote(
  client: DstackClient,
  reportData: string | Buffer | Uint8Array,
): Promise<{
  quote: string;
  event_log: string;
}> {
  // get TDX quote
  const ra = await client.getQuote(reportData);
  return ra;

  // const quote_hex = ra.quote.replace(/^0x/, '');

  // // get quote collateral
  // const formData = new FormData();
  // formData.append('hex', quote_hex);

  // // WARNING: this endpoint could throw or be offline
  // const result = await (
  //   await fetch('https://proof.t16z.com/api/upload', {
  //     method: 'POST',
  //     body: formData,
  //   })
  // ).json();

  // return {
  //   quote_hex,
  //   checksum: result.checksum,
  //   quote_collateral: result.quote_collateral,
  // }
}

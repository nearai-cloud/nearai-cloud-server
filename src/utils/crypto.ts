import { createHash } from 'crypto';
import nacl from 'tweetnacl';
import { getConfig } from '../config';

export async function litellmDecryptValue(
  valueBase64: string,
  signingKey?: string,
): Promise<string> {
  const config = await getConfig();

  signingKey = signingKey ?? config.litellm.signingKey

  const value = Buffer.from(valueBase64, 'base64');

  if (value.length === 0) {
    return '';
  }

  if (value.length < nacl.secretbox.nonceLength) {
    throw Error('Invalid value');
  }

  const signingKeyHash = createHash('sha256').update(signingKey).digest();

  const nonce = value.subarray(0, nacl.secretbox.nonceLength);
  const box = value.subarray(nacl.secretbox.nonceLength);
  const decryptedValue = nacl.secretbox.open(box, nonce, signingKeyHash);

  if (!decryptedValue) {
    throw new Error('Failed to decrypt value');
  }

  return Buffer.from(decryptedValue).toString();
}

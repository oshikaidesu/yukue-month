/**
 * microCMS API クライアント
 */

import { createClient } from 'microcms-js-sdk';

if (!process.env.MICROCMS_SERVICE_DOMAIN) {
  throw new Error(
    'MICROCMS_SERVICE_DOMAIN is not set. Please set it in your .env.local file.'
  );
}

if (!process.env.MICROCMS_API_KEY) {
  throw new Error(
    'MICROCMS_API_KEY is not set. Please set it in your .env.local file.'
  );
}

/**
 * microCMSクライアントのインスタンス
 */
export const microcms = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_API_KEY,
});


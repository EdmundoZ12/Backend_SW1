// src/notification/firebase.config.ts
import * as admin from 'firebase-admin';

const serviceAccount = {
  type: 'service_account',
  project_id: 'frontagenda1',
  private_key_id: 'ec5521e22f7f24f819d6ad4408e85fe7d7897776',
  private_key:
    '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDpwHA+5tZDfuIp\nUmBk4Sc/IQTyIbzjGu2/bvZ58hIm2ExRMySvszWTlZTk51mQW6ITEnwc51+Yglro\noIbVZl+m2kVEuB+f04UE3RJ53opkdp0nQwFm+1b0IHJoFOCGtF2h7KoXRJhvNMUg\n49XV5G9taSrCX7T7p/1ASnUWm46DAIC6WPvDzMowZb0vC/tGn7QJIzwBKOU3KEff\ncDzIYUO2t7leY83Xe4dK59CQsupgE3hQfEvZrycDBRQoN2jvBz++hwFzfz8k2Wdz\nWGaqcz7WFJcc0AtoSQLlWMFFvYU7BrpTxQ1WhzoUs6v2sh6vNlTVXPHDXOpMH4dW\nP8wwjmOfAgMBAAECggEAEBUSY/GD2l73dnpZcXdgOOKvsW0KzuFCbEJZKOizwQJu\ntcN8Ca6dyAqplNop+lmjnAZQjbiJhjepw4mP3UzO1e78hw7X9ioaY8xGAiaChQj4\nJQRiK1CtmdxFos2U6Q+txX8/8JvilPwfd/TU+INf+zoaHAdzr0DOlsbIqYaIVpDn\noLhTN23s/H0a2shtFys/It42RkW/wBgATdRwenR5o3jP/WH29h7l8sTMEVrn7JgW\nVav1x/j/oeen3b//OMlP/uv4SZOhAez0uvbzwGoDSRLAIsfVCfxrME2FkEwnCwVk\nX3a5Gk0iwccBqBPfVZkz/tuyJItcc8twrRn+fEAQgQKBgQDyFvMA5O1PocQKT6Pr\nLhB6X7hiD5yn69h0S05S+prpZVlMr++k5KkVYDLb7oQwDb5cXPGuqhcAWzkN4g0c\niZoNJj+7H1QLccElWP5KVu2uLFxDTGkcla4AnHJpF3eJX4DoFRJnmuCOKYPyoF/y\nIPWWuwvwgXFNT4A2YzrgBjyKXwKBgQD3LtddKaNUfoCURvLiwWPjad2zI3O2EHMs\nyERNOTJHBGmjzJqiVFAyzTK45bCdKt95h+DxjtGv1IUC9USkzsVwWmUu9o0Mqdeq\n26IeLdYW7oeaL3IgvQ/JL0D3KXatf2iPQhlSYquqG1hoQdoSIN+Cba4dzUZ0NpiX\nCTyzCRMuwQKBgQCMERcb51gegLvKM3Xltks2Yndt1RaQWXZtIrz4aaKDc24NXqXK\nw7nIclY6xW+Z1fnTurrikeqo/B6wl596aWrGPOEWxPN9g516nFjUbiMqaOQg0+7k\n6P05wUq43yj8RFNy8+4oH4XY+tAq6vtYPhWZ1jL8Pght8Jd/4D3KLBGPBQKBgC7x\nKFk69Rewxn5iUvIZQ/0GN+IzU2A6E4VnqwD3YcL25ZED5EH7vRdIvN88T6QpZjNQ\nSLnXI58+vtvm9FhQJFLH9/tJO1QyVRDPkSQmFEhamEoBxKzO+tZ8MNw/dZhRX+wE\n44Yv0uYFN27lQqK6t3evmKd0OnMLg0L7sBlYGdqBAoGAMd+5KZZapLYR+V371B9u\nSeuh7JajNSrOofGAT0jE7xE4/JkDV+1hbPxLcERjEzeCq0B+PCutvTl4PZIbMbHH\nMGjw+MZA9dRc8jZ5PPt1NEEJyuLbyLGi0SYuQWSA7nQtxSia5eNFL+fuFmdCouQh\nHXm455HeF/G7FY/c0ZngKWk=\n-----END PRIVATE KEY-----\n',
  client_email: 'firebase-adminsdk-vs9x2@frontagenda1.iam.gserviceaccount.com',
  client_id: '108605441818245510671',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-vs9x2%40frontagenda1.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com',
} as admin.ServiceAccount;

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin inicializado correctamente');
  } catch (error) {
    console.error('Error al inicializar Firebase Admin:', error);
  }
}

export default admin;

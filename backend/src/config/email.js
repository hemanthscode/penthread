import emailjs from 'emailjs-com';
import config from './index.js';

const serviceId = config.emailJsServiceId;
const templateId = config.emailJsTemplateId;
const userId = config.emailJsUserId;

export async function sendEmail(templateParams) {
  try {
    const response = await emailjs.send(serviceId, templateId, templateParams, userId);
    return response.status;
  } catch (error) {
    throw new Error(`Email sending failed: ${error.message}`);
  }
}

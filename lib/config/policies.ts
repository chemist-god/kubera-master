import { genVariable } from "./genVariable";

export const policies = {
  returnPolicy: genVariable.policies.returnPolicy,
  
  warranty: genVariable.policies.warranty,
  
  customerService: {
    email: genVariable.contact.email,
    phone: genVariable.contact.phone,
    hours: genVariable.contact.hours,
    supportUrl: genVariable.contact.supportUrl,
  },
  
  legal: genVariable.policies.legal,
  
  thankYou: genVariable.policies.thankYou,
  
  additionalNotes: genVariable.policies.additionalNotes,
};

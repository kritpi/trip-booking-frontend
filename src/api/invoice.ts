import Invoice from "@/interface/invoice";
import axios from "@/lib/axios.config";

export const createInvoice = async (invoice: any) => {
  try {
    await axios.post(`/user/invoice`, invoice);
    console.log("Invoice Created");    
  } catch (error) {    
    console.log(error);    
  }
}

export const getInvoice = async (invoiceId: string) => {
  try {
    const {data} = await axios.get(`/user/invoice/${invoiceId}`);
    console.log("Get Invoice", data);    
    return data;
  } catch (error) {
    console.log(error);    
  }
}

export const getInvoiceByTripId = async (tripId: string) => {
  try {
    const {data} = await axios.get(`user/invoice/trip/${tripId}`);
    console.log("Get Invoice by TripID", data);    
    return data;
  } catch (error) {
    console.log(error);    
  }
}

export const editInvoice = async (invoiceId: string, invoice: any) => {
  try {
    await axios.put(`/user/invoice/edit/${invoiceId}`, invoice);
    console.log("Invoice Edited");    
  } catch (error) {
    console.log(error);    
  }
}

export const deleteInvoice = async (invoiceId: string) => {
  try {
    await axios.delete(`/user/invoice/${invoiceId}`);
    console.log("Invoice Deleted");    
  } catch (error) {
    console.log(error);
  }
}
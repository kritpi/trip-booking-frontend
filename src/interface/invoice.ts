export default interface Invoice { 
  id: string; 
  pay_date_time: string;
  pay_price: number;
  pay_check_deposit: Boolean;
  pay_check_remaining: Boolean;
  user_id: string;
  trip_id: string;
}
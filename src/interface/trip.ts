export default interface Trip{
  id: string;
  requirement_id: string;
  start_date_time: string;
  end_date_time: string;
  city: string;
  arrival_location: string;
  departure_location: string;
  members: number; //amount of member in this trip
  hotel: string; //hotel name
  room_type: string; //room type
  breakfast_included: boolean; //breakfast included
  price: number; //price of this trip
  location: [
    {
      id: string;
      location: string;
      start_date_time: string; //start date time of this location
      end_date_time: string; //end date time of this location
      description: string; //description of this location
    }
  ];
  comment: string;
  create_at: string;
  status: string; //accept, edit, cancle, pending
}
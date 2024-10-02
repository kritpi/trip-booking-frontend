export default interface Requirement {
  requirement: {
    id: string;
    start_date_time: string;
    end_date_time: string;
    city: string;
    arrival_location: string;
    departure_location: string;
    room_type: string;
    breakfast_included: boolean;
    trip_description: string;
    create_at: string;
    owner_id: string;
  };
  
  memberList: {
    id: string;
    name: string;
    age: string;
    gender: string;
    allergy: string;
    dietary: string;
    owner_id: string;
  }[];
  //status: string; //creating, created, payment pending, deposite paid, total price paid, cancled
}
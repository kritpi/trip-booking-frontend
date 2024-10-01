export default interface Requirement {
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
  requirementMember: [
    {
      id: string;
      member_id: string;
      requirement_id: string;
    }
  ];
}
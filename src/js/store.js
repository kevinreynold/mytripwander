const store = {
  service_url : 'http://127.0.0.1:5000',
  flight_booking_data : [],
  flight_search_result : [],
  original_flight_search_result : [],
  flight_details : [],
  flight_ticket_url : undefined,
  //filter_flight_data
  sort_by: "price",
  price_filter: {
    from: 0,
    to: 0
  },
  outbond_departure: {
    from : 0,
    to: 48
  },
  outbond_arrival: {
    from : 0,
    to: 48
  },
  return_departure: {
    from : 0,
    to: 48
  },
  return_arrival: {
    from : 0,
    to: 48
  }
};

export default store;

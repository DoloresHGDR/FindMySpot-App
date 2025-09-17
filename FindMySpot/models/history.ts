export default interface ParkingHistory {
    id: string;
    startDate: string;
    endDate: string;
    address: string;
    plate: string;
    duration: string;
    price: string | number;
};

export default interface HistoryDTO {
  id: string;
  startDate: string;
  endDate: string;
  address: string;
  plate: string;
  duration: string;
  price: string | number;
}
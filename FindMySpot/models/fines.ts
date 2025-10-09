
export default interface PlateInterface {
    id: number;
    number: string;
    userId: number;
};

export default interface FinesInterface {
    id: number;
    description: string;
    amount: number;
    datetime: string;
    address: string | null;
    plateId: number;
};

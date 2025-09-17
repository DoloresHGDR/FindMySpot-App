export type Plate = {
    id: number;
    number: string;
    userId: number
};

export type User ={
    logged: boolean;
    id: string | null;
    name: string | null;
    surname: string | null;
    identityNumber: string | null;
    role: string | null;
    plate: Plate[] | [];
};
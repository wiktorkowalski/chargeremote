import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('VechicleDataImport')
export class VechicleData {
    @PrimaryColumn()
    vin: string;

    @Column()
    made: string;

    @Column()
    model: string;

    @Column()
    year: Date;
}

import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { VechicleData } from "./vechicleDataImport.entity";

@Entity('VechicleChargingDataImport')
export class VechicleChargeData {
    @PrimaryGeneratedColumn()
    id?: number;

    @ManyToOne(() => VechicleData, vechicleData => vechicleData)
    vechicleData: VechicleData;

    @Column()
    datetime: Date;

    @Column()
    soc: number;

    @Column()
    chargingPower: number;

    @Column()
    status: string;
}

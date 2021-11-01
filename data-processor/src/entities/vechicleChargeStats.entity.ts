import { VechicleData } from "src/entities/vechicleDataImport.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('VechicleChargeStats')
export class VechicleChargeStats {
    @PrimaryGeneratedColumn()
    id?: number;

    @ManyToOne(() => VechicleData, vechicleData => vechicleData, { eager: true })
    vechicleData: VechicleData;

    @CreateDateColumn()
    createDate?: Date;

    @Column()
    datetime: Date;

    @Column()
    soc: number;

    @Column("float")
    averageChargingPower: number;

    @Column()
    status: string;
}

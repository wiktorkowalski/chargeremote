import { VechicleData } from "src/importEntities/vechicleDataImport.entity";
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
    soc: number;

    @Column("decimal", { precision: 8, scale: 2 })
    averageChargingPower: number;

    @Column()
    status: string;
}

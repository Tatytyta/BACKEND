import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity';
import { Libro } from '../libros/libro.entity';

export enum EstadoPrestamo {
  ACTIVO = 'activo',
  DEVUELTO = 'devuelto',
  VENCIDO = 'vencido'
}

@Entity('prestamos')
export class Prestamo {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Usuario, usuario => usuario.prestamos)
    usuario: Usuario;

    @ManyToOne(() => Libro, libro => libro.prestamos)
    libro: Libro;

    @CreateDateColumn()
    fechaInicio: Date;

    @Column({ nullable: true })
    fechaFin: Date;

    @Column()
    fechaVencimiento: Date;

    @Column({
        type: 'enum',
        enum: EstadoPrestamo,
        default: EstadoPrestamo.ACTIVO
    })
    estado: EstadoPrestamo;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Genero } from '../generos/genero.entity';
import { Prestamo } from '../prestamos/prestamo.entity';

@Entity('libros')
export class Libro {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    titulo: string;

    @Column()
    autor: string;

    @Column({ unique: true })
    ISBN: string;

    @ManyToOne(() => Genero, genero => genero.libros)
    genero: Genero;

    @Column({ default: 1 })
    ejemplaresDisponibles: number;

    @Column({ default: 1 })
    ejemplaresTotales: number;

    @Column({ default: true })
    disponible: boolean;

    @Column({ nullable: true })
    fechaPublicacion: Date;

    @Column({ nullable: true })
    descripcion: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Prestamo, prestamo => prestamo.libro)
    prestamos: Prestamo[];
}
